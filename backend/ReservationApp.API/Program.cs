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

    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.WriteIndented = true;
            options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
            options.JsonSerializerOptions.Converters.Add(new ReservationApp.Application.Converters.UtcDateTimeJsonConverter());
        });
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new() { Title = "ReservationApp API", Version = "v1" });
    });

    builder.Services.AddInfrastructureServices(builder.Configuration);
    builder.Services.AddMemoryCache();
    builder.Services.AddApplicationServices();
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddFluentValidationClientsideAdapters();
    builder.Services.AddValidatorsFromAssemblyContaining<CreateReservationDtoValidator>();

    var allowedOrigins = new[]
    {
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:5180",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:3000",
        "http://127.0.0.1",
        "http://10.0.2.2"
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

    builder.Services.AddRateLimiter(options =>
    {
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

    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }

    app.UseSerilogRequestLogging();

    app.UseCors("LocalCorsPolicy");

    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();
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
