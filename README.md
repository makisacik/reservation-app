# Reservation App

A full-stack reservation management system with cross-platform mobile support, featuring a .NET 8 backend, React web frontend, iOS, and Android applications.

## Project Structure

```
reservation-app/
├── backend/          # .NET 8 Backend API
├── frontend/         # React Web Application
├── ios/              # iOS SwiftUI Application
└── android/          # Android Kotlin Application
```

## Screenshots

### Frontend (Web)
<div align="center">
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.02.11.png" width="200" alt="Frontend Screenshot 1"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.02.26.png" width="200" alt="Frontend Screenshot 2"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.02.39.png" width="200" alt="Frontend Screenshot 3"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.02.46.png" width="200" alt="Frontend Screenshot 4"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.02.56.png" width="200" alt="Frontend Screenshot 5"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.03.03.png" width="200" alt="Frontend Screenshot 6"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.03.09.png" width="200" alt="Frontend Screenshot 7"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.03.21.png" width="200" alt="Frontend Screenshot 8"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.03.27.png" width="200" alt="Frontend Screenshot 9"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.03.34.png" width="200" alt="Frontend Screenshot 10"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.03.44.png" width="200" alt="Frontend Screenshot 11"/>
  <img src="reservation ss/frontend/Screenshot 2025-11-14 at 17.03.57.png" width="200" alt="Frontend Screenshot 12"/>
</div>

### iOS
<div align="center">
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.48.20.png" width="200" alt="iOS Screenshot 1"/>
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.48.26.png" width="200" alt="iOS Screenshot 2"/>
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.49.19.png" width="200" alt="iOS Screenshot 3"/>
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.49.32.png" width="200" alt="iOS Screenshot 4"/>
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.49.55.png" width="200" alt="iOS Screenshot 5"/>
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.51.10.png" width="200" alt="iOS Screenshot 6"/>
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.51.19.png" width="200" alt="iOS Screenshot 7"/>
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.51.27.png" width="200" alt="iOS Screenshot 8"/>
  <img src="reservation ss/ios/Simulator Screenshot - iPhone 17 - 2025-11-14 at 16.51.35.png" width="200" alt="iOS Screenshot 9"/>
</div>

### Android
<div align="center">
  <img src="reservation ss/android/Screenshot_20251114_165305.png" width="200" alt="Android Screenshot 1"/>
  <img src="reservation ss/android/Screenshot_20251114_165345.png" width="200" alt="Android Screenshot 2"/>
  <img src="reservation ss/android/Screenshot_20251114_165354.png" width="200" alt="Android Screenshot 3"/>
  <img src="reservation ss/android/Screenshot_20251114_165404.png" width="200" alt="Android Screenshot 4"/>
  <img src="reservation ss/android/Screenshot_20251114_165419.png" width="200" alt="Android Screenshot 5"/>
  <img src="reservation ss/android/Screenshot_20251114_165428.png" width="200" alt="Android Screenshot 6"/>
  <img src="reservation ss/android/Screenshot_20251114_170009.png" width="200" alt="Android Screenshot 7"/>
  <img src="reservation ss/android/Screenshot_20251114_170019.png" width="200" alt="Android Screenshot 8"/>
  <img src="reservation ss/android/Screenshot_20251114_170026.png" width="200" alt="Android Screenshot 9"/>
</div>

---

## Backend

### Tech Stack
- **Framework**: .NET 8, ASP.NET Core Web API
- **Database**: PostgreSQL with Entity Framework Core 8.0
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation
- **Logging**: Serilog (Console, File, Seq)
- **Documentation**: Swagger/OpenAPI
- **Mapping**: AutoMapper
- **Password Hashing**: BCrypt.Net

### Architecture & Patterns
- **Clean Architecture** with clear separation of concerns:
  - **API Layer**: Controllers, middleware, dependency injection, Swagger configuration
  - **Application Layer**: Business logic, DTOs, services, validation, interfaces
  - **Domain Layer**: Entities, enums, domain exceptions (no external dependencies)
  - **Infrastructure Layer**: Data access, EF Core, repositories, database configuration
- **Repository Pattern** for data access abstraction
- **Dependency Injection** via interfaces only
- **Middleware-based** exception handling with centralized error responses
- **RESTful API** design with proper HTTP status codes

### Security
- **JWT Authentication** with token validation (issuer, audience, lifetime, signing key)
- **BCrypt password hashing** for secure credential storage
- **Role-based authorization** (Admin, User) with policy-based access control
- **HTTPS enforcement** in production
- **CORS policy** configured for specific origins
- **Secrets management** via configuration files (never hardcoded)
- **Input validation** using FluentValidation to prevent injection attacks
- **Centralized exception handling** prevents information leakage

### Features
- User authentication (register, login, JWT tokens)
- Reservation management (create, view, update, cancel)
- Restaurant and menu management
- Meal time slot management
- Admin dashboard with statistics and reports
- User profile management
- Weekly reservation limits enforcement
- Email notifications (configurable)
- Timezone-aware date/time handling

### How to Run

1. **Prerequisites**:
   - .NET 8 SDK
   - PostgreSQL 12+
   - EF Core tools: `dotnet tool install --global dotnet-ef`

2. **Configure Database**:
   Update `backend/ReservationApp.API/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=reservationdb;Username=postgres;Password=yourpassword"
     }
   }
   ```

3. **Create Database**:
   ```bash
   psql -U postgres
   CREATE DATABASE reservationdb;
   \q
   ```

4. **Run Migrations**:
   ```bash
   cd backend
   dotnet ef migrations add InitialCreate -p ReservationApp.Infrastructure -s ReservationApp.API
   dotnet ef database update -p ReservationApp.Infrastructure -s ReservationApp.API
   ```

5. **Run Application**:
   ```bash
   cd backend/ReservationApp.API
   dotnet run
   ```

6. **Access**:
   - Swagger UI: `https://localhost:7195/swagger`
   - API: `https://localhost:7195` or `http://localhost:5053`

---

## Frontend

### Tech Stack
- **Framework**: React 19 with Vite
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Context API, TanStack Query (React Query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Date Handling**: Day.js
- **Styling**: Emotion (CSS-in-JS)

### Architecture & Patterns
- **Component-based architecture** with reusable UI components
- **Context API** for global state (authentication)
- **React Query** for server state management, caching, and synchronization
- **Custom hooks** for reusable logic
- **API abstraction layer** with centralized axios client
- **Route protection** with authentication guards
- **Modular structure** separating pages, components, API, and utilities

### Security
- **JWT token storage** in localStorage (with automatic cleanup on 401)
- **Axios interceptors** for automatic token injection and error handling
- **Protected routes** requiring authentication
- **Automatic logout** on token expiration or invalid credentials
- **Secure API communication** via HTTPS in production
- **Input validation** on forms

### Features
- User authentication (login, register, logout)
- Reservation management (view, create, edit, cancel)
- Restaurant and menu browsing
- Personal dashboard with statistics
- Profile management
- Admin panel (dashboard, user management, menu management, reservations)
- Responsive design for desktop and mobile
- Real-time data updates with React Query

### How to Run

1. **Prerequisites**:
   - Node.js 18+
   - npm or yarn

2. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Configure API URL** (optional):
   Create `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:5053/api
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Access**:
   - Application: `http://localhost:5173`

---

## iOS

### Tech Stack
- **Language**: Swift
- **Framework**: SwiftUI
- **Architecture**: MVVM (Model-View-ViewModel)
- **Networking**: URLSession with async/await
- **Reactive Programming**: Combine framework
- **Storage**: Keychain Services for secure token storage
- **Image Caching**: Custom image cache service

### Architecture & Patterns
- **MVVM architecture** with ViewModels managing business logic
- **Repository pattern** for data access abstraction (AuthRepository, ReservationRepository, etc.)
- **Protocol-oriented design** with repository protocols
- **Dependency injection** via shared singletons (APIClient, KeychainManager)
- **Separation of concerns**: Core (network, storage, services), Data (repositories), Domain (models, enums), Presentation (views, view models)
- **Theme management** with centralized colors, typography, and spacing

### Security
- **Keychain Services** for secure JWT token storage (encrypted, hardware-backed)
- **HTTPS-only** API communication
- **Token-based authentication** with automatic token injection
- **Automatic logout** on 401 unauthorized responses
- **Secure credential handling** (no plaintext storage)

### Features
- User authentication (login, logout)
- Reservation management (create, view, cancel)
- Restaurant and menu browsing
- Personal dashboard with statistics
- Profile management
- Admin features (dashboard, user management, menu management, reservations)
- Onboarding flow
- Image caching for performance
- Dark mode support (via theme system)

### How to Run

1. **Prerequisites**:
   - Xcode 14+ (with iOS 15+ SDK)
   - macOS
   - CocoaPods (if using pods)

2. **Open Project**:
   ```bash
   cd ios
   open ReservationApp/ReservationApp.xcodeproj
   ```

3. **Configure API URL** (if needed):
   Update `AppConstants.API.baseURL` in `Core/Constants/AppConstants.swift`

4. **Run**:
   - Select a simulator or connected device
   - Press `Cmd + R` or click Run

---

## Android

### Tech Stack
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM (Model-View-ViewModel)
- **Dependency Injection**: Hilt (Dagger)
- **Networking**: Retrofit 2 + OkHttp + Gson
- **Storage**: DataStore Preferences + Encrypted Preferences
- **Image Loading**: Coil
- **Logging**: Timber
- **Coroutines**: Kotlin Coroutines for async operations

### Architecture & Patterns
- **Modular architecture** with feature modules:
  - **Core modules**: common, network, storage, ui
  - **Domain layer**: business logic, use cases, models
  - **Data layer**: repositories, data sources
  - **Feature modules**: auth, home, profile, reservations, make-reservation
- **MVVM pattern** with ViewModels and Compose UI
- **Repository pattern** for data access
- **Dependency injection** with Hilt
- **Clean Architecture** principles with clear layer separation

### Security
- **Encrypted Preferences** (AndroidX Security Crypto) for secure token storage
- **HTTPS-only** API communication
- **JWT token-based authentication** with automatic token injection
- **Secure credential storage** using Android Keystore-backed encryption
- **Automatic token refresh** and logout on authentication failures

### Features
- User authentication (login, logout)
- Reservation management (create, view, cancel)
- Restaurant and menu browsing
- Personal dashboard with statistics
- Profile management
- Admin features (dashboard, user management, menu management, reservations)
- Material Design 3 UI
- Image loading and caching
- Offline support capabilities

### How to Run

1. **Prerequisites**:
   - Android Studio Hedgehog (2023.1.1) or later
   - JDK 17+
   - Android SDK (API 24+)

2. **Open Project**:
   ```bash
   cd android
   # Open in Android Studio
   ```

3. **Configure API URL** (if needed):
   Update base URL in network module configuration

4. **Sync & Build**:
   - Android Studio will sync Gradle automatically
   - Build: `Build > Make Project` or `Ctrl+F9` (Windows/Linux) / `Cmd+F9` (Mac)

5. **Run**:
   - Select an emulator or connected device
   - Click Run or press `Shift+F10` (Windows/Linux) / `Ctrl+R` (Mac)

---

## Testing

### Backend Tests
```bash
cd backend
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

