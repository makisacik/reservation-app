#!/bin/bash

# Run script for ReservationApp API
# This script builds and runs the application with proper output

set -e

echo "Building ReservationApp API..."
dotnet build --verbosity minimal

if [ $? -eq 0 ]; then
    echo ""
    echo "Build succeeded. Starting application..."
    echo ""
    dotnet run --project ReservationApp.API/ReservationApp.API.csproj
else
    echo "Build failed. Please check the errors above."
    exit 1
fi
