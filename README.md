# ReservationApp Backend

A clean architecture .NET 8 + PostgreSQL backend for a reservation system.

## Prerequisites

- .NET 8 SDK
- PostgreSQL (version 12 or higher)
- Entity Framework Core tools (if not already installed): `dotnet tool install --global dotnet-ef`

## Setup Instructions

### 1. Configure Database Connection

Update the connection string in `ReservationApp.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=reservationdb;Username=postgres;Password=yourpassword"
  }
}
```

Replace `yourpassword` with your actual PostgreSQL password.

### 2. Create PostgreSQL Database

Connect to PostgreSQL and create the database:

```bash
psql -U postgres
CREATE DATABASE reservationdb;
\q
```

### 3. Create and Apply Database Migrations

From the solution root directory:

```bash
# Create initial migration
dotnet ef migrations add InitialCreate -p ReservationApp.Infrastructure -s ReservationApp.API

# Apply migration to database
dotnet ef database update -p ReservationApp.Infrastructure -s ReservationApp.API
```

### 4. Run the Application

#### Option 1: Using dotnet CLI (Recommended)

```bash
cd ReservationApp.API
dotnet run
```

#### Option 2: Using Visual Studio / Rider

- Set `ReservationApp.API` as the startup project
- Press F5 or click Run

#### Option 3: Using VS Code

- Open the solution folder
- Select `ReservationApp.API` as the startup project
- Press F5

### 5. Access the Application

Once the application is running, you can access:

- **Swagger UI**: https://localhost:7195/swagger (or http://localhost:5053/swagger)
- **HTTPS API**: https://localhost:7195
- **HTTP API**: http://localhost:5053

The browser should automatically open to the Swagger UI page.

## API Endpoints

- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/{id}` - Get reservation by ID
- `POST /api/reservations` - Create a new reservation

## Testing

Run the unit tests:

```bash
dotnet test
```

## Project Structure

```
ReservationApp/
├── ReservationApp.API/          # Web API entry point
├── ReservationApp.Application/   # Business logic, DTOs, Services
├── ReservationApp.Domain/        # Entities, Domain logic
├── ReservationApp.Infrastructure/# Data access, EF Core, Repositories
└── ReservationApp.Tests/         # Unit tests
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `pg_isready`
- Verify connection string credentials
- Check if the database exists: `psql -U postgres -l`

### Migration Issues

- Ensure EF Core tools are installed: `dotnet ef --version`
- Check that the connection string is correct
- Verify PostgreSQL is accessible

### Port Already in Use

If port 7195 or 5053 is already in use, update `launchSettings.json` or specify a different port:

```bash
dotnet run --urls "https://localhost:7000;http://localhost:5000"
```

