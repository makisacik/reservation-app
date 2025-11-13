pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "ReservationApp"

// Core modules
include(":core:common")
include(":core:network")
include(":core:storage")
include(":core:ui")

// Domain module
include(":domain")

// Data module
include(":data")

// Feature modules (will be added in later phases)
// include(":feature:auth")
// include(":feature:home")
// include(":feature:reservations")
// include(":feature:profile")
// include(":feature:make-reservation")
// include(":feature:admin:dashboard")
// include(":feature:admin:reservations")
// include(":feature:admin:menu")
// include(":feature:admin:users")
// include(":feature:admin:settings")

// App module
include(":app")
