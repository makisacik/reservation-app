package com.reservationapp.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.reservationapp.DependencyContainer
import com.reservationapp.feature.auth.ui.LoginScreen

@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String
) {
    val authRepository = DependencyContainer.getAuthRepository()
    val authStateManager = DependencyContainer.getAuthStateManager()

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Onboarding.route) {
            // Placeholder for onboarding screen
            // TODO: Implement onboarding screen in later phase
            LoginScreen(
                authRepository = authRepository,
                authStateManager = authStateManager,
                onLoginSuccess = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Login.route) {
            LoginScreen(
                authRepository = authRepository,
                authStateManager = authStateManager,
                onLoginSuccess = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Home.route) {
            // Placeholder for home screen
            // TODO: Implement home screen in later phase
            androidx.compose.material3.Text("Home Screen - Coming Soon")
        }
    }
}

