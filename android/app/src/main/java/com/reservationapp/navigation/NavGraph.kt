package com.reservationapp.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.reservationapp.DependencyContainer
import com.reservationapp.feature.auth.ui.LoginScreen
import com.reservationapp.feature.home.ui.HomeScreen
import com.reservationapp.feature.profile.ui.ProfileScreen

@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String
) {
    val authRepository = DependencyContainer.getAuthRepository()
    val authStateManager = DependencyContainer.getAuthStateManager()
    val homeRepository = DependencyContainer.getHomeRepository()

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
            HomeScreen(
                homeRepository = homeRepository,
                authRepository = authRepository,
                authStateManager = authStateManager
            )
        }

        composable(Screen.Profile.route) {
            ProfileScreen(
                authRepository = authRepository,
                authStateManager = authStateManager
            )
        }
    }
}

