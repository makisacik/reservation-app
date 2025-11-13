package com.reservationapp

/**
 * App-wide constants matching iOS app configuration
 */
object AppConstants {
    // API Configuration - Same as iOS app
    object API {
        // Use 127.0.0.1 instead of localhost for Android Emulator compatibility
        const val BASE_URL = "http://127.0.0.1:5053/api/"

        object Endpoints {
            // Auth endpoints
            const val LOGIN = "/auth/login"
            const val REGISTER = "/auth/register"

            // User endpoints
            const val CURRENT_USER = "/users/me"
            const val ALL_USERS = "/users"
            const val ADMIN_USERS = "/admin/users"
            const val UPDATE_USER_PROFILE = "/users/me"

            // Home endpoints
            const val HOME_STATS = "/home/stats"

            // Menu endpoints
            const val MENU_CATEGORIES = "/menu-categories"
            const val MEALS = "/meals"
            const val MENUS = "/menus"

            // Reservation endpoints
            const val MY_RESERVATIONS = "/reservations/my"
            const val CREATE_RESERVATION = "/reservations"
            const val GET_RESERVATION = "/reservations/{id}"

            // Restaurant & Meal Time endpoints
            const val RESTAURANTS = "/restaurants"
            const val MEAL_TIME_SLOTS = "/mealtimes"

            // Admin Dashboard endpoints
            const val ADMIN_DASHBOARD_SUMMARY = "/admin/dashboard/summary"
            const val ADMIN_POPULAR_MEALS = "/admin/dashboard/popular-meals"
            const val ADMIN_TODAY_RESERVATIONS = "/admin/dashboard/today-reservations"
            const val ADMIN_WEEKLY_TRENDS = "/admin/dashboard/weekly"
            const val ADMIN_DAILY_SUMMARY = "/admin/dashboard/daily-summary"

            // Admin Reservations endpoints
            const val ADMIN_RESERVATIONS = "/admin/reservations"
            const val ADMIN_APPROVE_RESERVATION = "/admin/reservations/{id}/approve"
            const val ADMIN_CANCEL_RESERVATION = "/admin/reservations/{id}/cancel"
            const val RESERVATION_SUMMARY = "/admin/reservations/summary"

            // Admin Meals endpoints
            const val ADMIN_MEALS = "/admin/meals"
            const val ADMIN_MEAL = "/admin/meals/{id}"
            const val ADMIN_CREATE_MEAL = "/admin/meals"
            const val ADMIN_UPDATE_MEAL = "/admin/meals/{id}"
            const val ADMIN_DELETE_MEAL = "/admin/meals/{id}"

            // Admin Users endpoints
            const val ADMIN_USER_STATISTICS = "/admin/users/statistics"
            const val ADMIN_CREATE_USER = "/admin/users"
            const val ADMIN_UPDATE_USER = "/admin/users/{id}"
            const val ADMIN_DELETE_USER = "/admin/users/{id}"

            // Admin Settings endpoints
            const val ADMIN_GENERAL_SETTINGS = "/admin/settings/general"
            const val ADMIN_RESERVATION_SETTINGS = "/admin/settings/reservation"
            const val ADMIN_NOTIFICATION_SETTINGS = "/admin/settings/notifications"
        }
    }

    // Storage Keys
    object StorageKeys {
        const val AUTH_TOKEN = "auth_token"
        const val REFRESH_TOKEN = "refresh_token"
        const val USER_DATA = "user_data"
    }

    // User Roles
    enum class UserRole(val value: String) {
        ADMIN("Admin"),
        USER("User"),
        PERSONEL("Personel");

        val isAdmin: Boolean
            get() = this == ADMIN
    }

    // Network Configuration
    object Network {
        const val CONNECT_TIMEOUT_SECONDS = 30L
        const val READ_TIMEOUT_SECONDS = 30L
        const val WRITE_TIMEOUT_SECONDS = 30L
    }
}

