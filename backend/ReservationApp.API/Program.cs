using System.Text;
using System.Threading.RateLimiting;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ReservationApp.API.Extensions;
using ReservationApp.API.Middleware;
using ReservationApp.Application.Helpers;
using ReservationApp.Application.Interfaces;
using ReservationApp.Application.Validation;
using ReservationApp.Infrastructure.Data;
using ReservationApp.Infrastructure.Extensions;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog early to see startup logs
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithProcessId()
    .Enrich.WithThreadId()
    .Filter.ByExcluding(logEvent => 
        logEvent.Exception != null &&
        (logEvent.Exception.Message.Contains("Bad address") || 
         (logEvent.Exception.InnerException?.Message.Contains("Bad address") == true)) &&
        logEvent.Properties.TryGetValue("SourceContext", out var sourceContext) &&
        sourceContext?.ToString().Contains("Microsoft.AspNetCore.Server.Kestrel") == true)
    .CreateLogger();

try
{
    Log.Information("Starting ReservationApp API...");
    builder.Host.UseSerilog();

    // Add services to the container
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.WriteIndented = true;
            // Serialize enums as strings instead of numbers
            options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
            // Add custom DateTime converter to handle Unspecified dates
            options.JsonSerializerOptions.Converters.Add(new ReservationApp.Application.Converters.UtcDateTimeJsonConverter());
        });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new() { Title = "ReservationApp API", Version = "v1" });
    });

    // Add Infrastructure services
    builder.Services.AddInfrastructureServices(builder.Configuration);

    // Add Memory Cache
    builder.Services.AddMemoryCache();

    // Add Application services
    builder.Services.AddApplicationServices();

    // Add FluentValidation
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddFluentValidationClientsideAdapters();
    builder.Services.AddValidatorsFromAssemblyContaining<CreateReservationDtoValidator>();

    // Add CORS
    // Allow common development ports for Vite (5173-5180) and React (3000-3010)
    var allowedOrigins = new[]
    {
        "http://localhost:3000",   // React dev server (Create React App)
        "http://localhost:5173",   // Vite dev server (default)
        "http://localhost:5174",   // Vite dev server (fallback)
        "http://localhost:5175",   // Vite dev server (fallback)
        "http://localhost:5176",   // Vite dev server (fallback)
        "http://localhost:5177",   // Vite dev server (fallback)
        "http://localhost:5178",   // Vite dev server (fallback)
        "http://localhost:5179",   // Vite dev server (fallback)
        "http://localhost:5180",   // Vite dev server (fallback)
        "http://127.0.0.1:5173",   // Vite dev server (alternative)
        "http://127.0.0.1:5174",   // Vite dev server (alternative)
        "http://127.0.0.1:5175",   // Vite dev server (alternative)
        "http://127.0.0.1:3000",    // React dev server (alternative)
        "http://127.0.0.1",        // iOS simulator
        "http://10.0.2.2"          // Android emulator
    };

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("LocalCorsPolicy", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });

    // Add JWT Authentication
    var jwtKey = builder.Configuration["Jwt:Key"]
        ?? throw new InvalidOperationException("JWT Key not found in configuration.");
    
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });

    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
        options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
    });

    // Add Rate Limiting
    builder.Services.AddRateLimiter(options =>
    {
        // 10,000 requests every 10 minutes per IP — practically unlimited for dev
        options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
        {
            var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            return RateLimitPartition.GetTokenBucketLimiter(
                ip,
                _ => new TokenBucketRateLimiterOptions
                {
                    TokenLimit = 10000,
                    TokensPerPeriod = 10000,
                    ReplenishmentPeriod = TimeSpan.FromMinutes(10),
                    AutoReplenishment = true,
                    QueueLimit = 0,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                });
        });
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    });

    var app = builder.Build();

    // Seed database in Development mode
    if (app.Environment.IsDevelopment())
    {
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<ReservationDbContext>();
                await DbSeeder.SeedAsync(context);
                Log.Information("Database seeded successfully");
                
                // Initialize DateTimeConversionHelper with timezone from database
                var timezoneService = services.GetRequiredService<ITimezoneService>();
                var timezone = await timezoneService.GetApplicationTimezoneAsync();
                DateTimeConversionHelper.Initialize(timezone);
                Log.Information("DateTimeConversionHelper initialized with timezone: {Timezone}", timezone.Id);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "An error occurred while seeding the database");
            }
        }

        app.UseSwagger();
        app.UseSwaggerUI();
    }
    else
    {
        // Initialize DateTimeConversionHelper in production as well
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var timezoneService = services.GetRequiredService<ITimezoneService>();
                var timezone = await timezoneService.GetApplicationTimezoneAsync();
                DateTimeConversionHelper.Initialize(timezone);
                Log.Information("DateTimeConversionHelper initialized with timezone: {Timezone}", timezone.Id);
            }
            catch (Exception ex)
            {
                Log.Warning(ex, "Failed to initialize DateTimeConversionHelper, will use default timezone");
            }
        }
    }

    // Only use HTTPS redirection in production
    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }

    // Add Serilog request logging
    app.UseSerilogRequestLogging();

    app.UseCors("LocalCorsPolicy");

    app.UseRateLimiter();

    // Add authentication and authorization middleware
    app.UseAuthentication();
    app.UseAuthorization();

    // Add exception handling middleware
    app.UseMiddleware<ExceptionHandlingMiddleware>();

    app.MapControllers();

    Log.Information("ReservationApp API configured. Starting...");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application failed to start");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
