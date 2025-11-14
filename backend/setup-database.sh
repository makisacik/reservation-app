#!/bin/bash

# Database Setup Script for ReservationApp
# This script helps set up the PostgreSQL database and run migrations

set -e

echo "=== ReservationApp Database Setup ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Detect PostgreSQL user
# Try postgres first, then fall back to current user (common on macOS/Homebrew)
# Temporarily disable set -e for this check
set +e
psql -U postgres -c "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    PGUSER="postgres"
else
    PGUSER=$(whoami)
    echo -e "${YELLOW}Note: Using PostgreSQL user '${PGUSER}' (postgres user not found, common on macOS/Homebrew)${NC}"
    echo ""
fi
set -e

# Check if PostgreSQL is running
echo "Checking if PostgreSQL is running..."
if ! pg_isready -U "$PGUSER" > /dev/null 2>&1; then
    echo -e "${RED}Error: PostgreSQL is not running or not accessible.${NC}"
    echo "Please start PostgreSQL and try again."
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL is running${NC}"
echo ""

# Determine which database to connect to for admin operations
# Try postgres database first, then template1 (both are system databases that always exist)
set +e
psql -U "$PGUSER" -d postgres -c "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    ADMIN_DB="postgres"
else
    ADMIN_DB="template1"
fi
set -e

# Check if database exists
echo "Checking if database 'reservationdb' exists..."
if psql -U "$PGUSER" -d "$ADMIN_DB" -lqt | cut -d \| -f 1 | grep -qw reservationdb; then
    echo -e "${YELLOW}⚠ Database 'reservationdb' already exists${NC}"
    read -p "Do you want to recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping existing database..."
        psql -U "$PGUSER" -d "$ADMIN_DB" -c "DROP DATABASE IF EXISTS reservationdb;"
        echo "Creating new database..."
        psql -U "$PGUSER" -d "$ADMIN_DB" -c "CREATE DATABASE reservationdb;"
        echo -e "${GREEN}✓ Database created${NC}"
    else
        echo "Using existing database..."
    fi
else
    echo "Creating database 'reservationdb'..."
    psql -U "$PGUSER" -d "$ADMIN_DB" -c "CREATE DATABASE reservationdb;"
    echo -e "${GREEN}✓ Database created${NC}"
fi
echo ""

# Check if dotnet-ef is installed
echo "Checking if Entity Framework Core tools are installed..."
if ! dotnet ef --version > /dev/null 2>&1; then
    echo "Installing Entity Framework Core tools..."
    dotnet tool install --global dotnet-ef
    echo -e "${GREEN}✓ EF Core tools installed${NC}"
else
    echo -e "${GREEN}✓ EF Core tools are installed${NC}"
fi
echo ""

# Check if migrations folder exists
if [ -d "ReservationApp.Infrastructure/Migrations" ]; then
    echo -e "${YELLOW}⚠ Migrations folder already exists${NC}"
    echo "Migrations may already be applied."
else
    echo "Creating initial migration..."
    dotnet ef migrations add InitialCreate -p ReservationApp.Infrastructure -s ReservationApp.API
    echo -e "${GREEN}✓ Migration created${NC}"
fi
echo ""

# Apply migrations
echo "Applying migrations to database..."
dotnet ef database update -p ReservationApp.Infrastructure -s ReservationApp.API
echo -e "${GREEN}✓ Migrations applied${NC}"
echo ""

echo -e "${GREEN}=== Database setup complete! ===${NC}"
echo ""
echo "You can now run the application with:"
echo "  cd ReservationApp.API"
echo "  dotnet run"
echo ""
echo "Then access Swagger at: https://localhost:7195/swagger"

