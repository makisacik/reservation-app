using System.Net;
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using ReservationApp.Domain.Exceptions;

namespace ReservationApp.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Log client errors (4xx) as Warning, server errors (5xx) as Error
            var isClientError = ex is BadRequestException or NotFoundException or DomainException or ArgumentException or ArgumentNullException or KeyNotFoundException;
            
            if (isClientError)
            {
                _logger.LogWarning(ex, 
                    "Client error occurred. RequestPath: {RequestPath}, Method: {Method}, StatusCode: {StatusCode}",
                    context.Request.Path, 
                    context.Request.Method,
                    ex switch
                    {
                        NotFoundException or KeyNotFoundException => 404,
                        _ => 400
                    });
            }
            else
            {
                _logger.LogError(ex, 
                    "An unhandled exception occurred. RequestPath: {RequestPath}, Method: {Method}",
                    context.Request.Path, 
                    context.Request.Method);
            }
            
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var problemDetails = exception switch
        {
            NotFoundException notFoundException => CreateProblemDetails(
                HttpStatusCode.NotFound,
                "Not Found",
                notFoundException.Message,
                context.Request.Path
            ),
            BadRequestException badRequestException => CreateProblemDetails(
                HttpStatusCode.BadRequest,
                "Bad Request",
                badRequestException.Message,
                context.Request.Path
            ),
            DomainException domainException => CreateProblemDetails(
                HttpStatusCode.BadRequest,
                "Bad Request",
                domainException.Message,
                context.Request.Path
            ),
            ValidationException validationException => CreateValidationProblemDetails(
                HttpStatusCode.BadRequest,
                "Validation Error",
                "One or more validation errors occurred.",
                validationException,
                context.Request.Path
            ),
            ArgumentNullException or ArgumentException => CreateProblemDetails(
                HttpStatusCode.BadRequest,
                "Bad Request",
                exception.Message,
                context.Request.Path
            ),
            KeyNotFoundException => CreateProblemDetails(
                HttpStatusCode.NotFound,
                "Not Found",
                exception.Message,
                context.Request.Path
            ),
            _ => CreateProblemDetails(
                HttpStatusCode.InternalServerError,
                "Internal Server Error",
                "An error occurred while processing your request.",
                context.Request.Path
            )
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = problemDetails.Status ?? (int)HttpStatusCode.InternalServerError;

        var result = JsonSerializer.Serialize(problemDetails, JsonOptions);
        return context.Response.WriteAsync(result);
    }

    private static ProblemDetails CreateProblemDetails(
        HttpStatusCode statusCode,
        string title,
        string detail,
        string? instance = null)
    {
        return new ProblemDetails
        {
            Type = $"https://tools.ietf.org/html/rfc7231#section-6.5.{(int)statusCode / 100}",
            Title = title,
            Status = (int)statusCode,
            Detail = detail,
            Instance = instance
        };
    }

    private static ProblemDetails CreateValidationProblemDetails(
        HttpStatusCode statusCode,
        string title,
        string detail,
        ValidationException validationException,
        string? instance = null)
    {
        var problemDetails = new ProblemDetails
        {
            Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
            Title = title,
            Status = (int)statusCode,
            Detail = detail,
            Instance = instance
        };

        var errors = new Dictionary<string, string[]>();
        foreach (var error in validationException.Errors)
        {
            var propertyName = error.PropertyName;
            if (errors.ContainsKey(propertyName))
            {
                var existingErrors = errors[propertyName].ToList();
                existingErrors.Add(error.ErrorMessage);
                errors[propertyName] = existingErrors.ToArray();
            }
            else
            {
                errors[propertyName] = new[] { error.ErrorMessage };
            }
        }

        problemDetails.Extensions["errors"] = errors;
        return problemDetails;
    }
}
