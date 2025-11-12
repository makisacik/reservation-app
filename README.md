# Reservation App

A full-stack reservation system with a .NET 8 backend and frontend application.

## Project Structure

```
reservation-app/
├── backend/                    # .NET 8 Backend API
│   ├── ReservationApp.API/     # Web API entry point
│   ├── ReservationApp.Application/  # Business logic, DTOs, Services
│   ├── ReservationApp.Domain/  # Entities, Domain logic
│   ├── ReservationApp.Infrastructure/  # Data access, EF Core, Repositories
│   ├── ReservationApp.Tests/   # Unit tests
│   ├── ReservationApp.sln      # Solution file
│   └── [scripts and docs]      # Setup and testing scripts
│
└── frontend/                   # Frontend application
    ├── src/                    # Source code
    ├── public/                 # Public assets
    └── package.json            # Frontend dependencies
```

## Backend Setup

### Prerequisites

- .NET 8 SDK
- PostgreSQL (version 12 or higher)
- Entity Framework Core tools (if not already installed): `dotnet tool install --global dotnet-ef`

### Setup Instructions

#### 1. Configure Database Connection

Update the connection string in `backend/ReservationApp.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=reservationdb;Username=postgres;Password=yourpassword"
  }
}
```

Replace `yourpassword` with your actual PostgreSQL password.

#### 2. Create PostgreSQL Database

Connect to PostgreSQL and create the database:

```bash
psql -U postgres
CREATE DATABASE reservationdb;
\q
```

#### 3. Create and Apply Database Migrations

From the backend directory:

```bash
cd backend

# Create initial migration
dotnet ef migrations add InitialCreate -p ReservationApp.Infrastructure -s ReservationApp.API

# Apply migration to database
dotnet ef database update -p ReservationApp.Infrastructure -s ReservationApp.API
```

#### 4. Run the Backend Application

##### Option 1: Using dotnet CLI (Recommended)

```bash
cd backend/ReservationApp.API
dotnet run
```

##### Option 2: Using Visual Studio / Rider

- Open `backend/ReservationApp.sln`
- Set `ReservationApp.API` as the startup project
- Press F5 or click Run

##### Option 3: Using VS Code

- Open the `backend` folder
- Select `ReservationApp.API` as the startup project
- Press F5

#### 5. Access the Backend API

Once the application is running, you can access:

- **Swagger UI**: https://localhost:7195/swagger (or http://localhost:5053/swagger)
- **HTTPS API**: https://localhost:7195
- **HTTP API**: http://localhost:5053

The browser should automatically open to the Swagger UI page.

## Frontend Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Setup Instructions

> **Note**: Frontend setup is pending. Check back soon for setup instructions.

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/{id}` - Get reservation by ID
- `POST /api/reservations` - Create a new reservation

See `backend/ReservationApp.API` for complete API documentation via Swagger.

## Testing

### Backend Tests

Run the backend unit tests:

```bash
cd backend
dotnet test
```

### Frontend Tests

> **Note**: Frontend testing setup is pending.

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `pg_isready`
- Verify connection string credentials in `backend/ReservationApp.API/appsettings.Development.json`
- Check if the database exists: `psql -U postgres -l`

### Migration Issues

- Ensure EF Core tools are installed: `dotnet ef --version`
- Check that the connection string is correct
- Verify PostgreSQL is accessible
- Make sure you're running migrations from the `backend` directory

### Port Already in Use

If port 7195 or 5053 is already in use, update `backend/ReservationApp.API/Properties/launchSettings.json` or specify a different port:

```bash
cd backend/ReservationApp.API
dotnet run --urls "https://localhost:7000;http://localhost:5000"
```

## Development

### Backend

The backend follows Clean Architecture principles with the following layers:

- **API**: Controllers, middleware, dependency injection
- **Application**: Business logic, DTOs, services, validation
- **Domain**: Entities, enums, domain exceptions
- **Infrastructure**: Data access, EF Core, repositories

### Frontend

> **Note**: Frontend architecture details will be added once the frontend is set up.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Create a Pull Request

## License

[Add your license here]
