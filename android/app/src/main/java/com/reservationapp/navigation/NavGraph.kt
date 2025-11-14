package com.reservationapp.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.reservationapp.DependencyContainer
import com.reservationapp.feature.auth.ui.LoginScreen
import com.reservationapp.feature.home.ui.HomeScreen
import com.reservationapp.feature.makereservation.ui.MakeReservationScreen
import com.reservationapp.feature.profile.ui.ProfileScreen

@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String
) {
    val authRepository = DependencyContainer.getAuthRepository()
    val authStateManager = DependencyContainer.getAuthStateManager()
    val homeRepository = DependencyContainer.getHomeRepository()
    val reservationRepository = DependencyContainer.getReservationRepository()

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
                authStateManager = authStateManager,
                onNavigateToReservation = {
                    navController.navigate(Screen.MakeReservation.route)
                }
            )
        }

        composable(Screen.MakeReservation.route) {
            MakeReservationScreen(
                reservationRepository = reservationRepository,
                homeRepository = homeRepository,
                onNavigateBack = {
                    navController.popBackStack()
                },
                onReservationCreated = {
                    navController.popBackStack()
                    // Optionally navigate to reservations list
                    // navController.navigate(Screen.Reservations.route)
                }
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

