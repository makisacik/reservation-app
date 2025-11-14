package com.reservationapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.reservationapp.core.ui.theme.ReservationAppTheme
import com.reservationapp.navigation.NavGraph
import com.reservationapp.navigation.Screen
import com.reservationapp.ui.MainTabView

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val authStateManager = DependencyContainer.getAuthStateManager()
        // Check auth state on startup
        authStateManager.checkAuthState()

        setContent {
            ReservationAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    val authStateManager = remember { DependencyContainer.getAuthStateManager() }
                    val isAuthenticated by authStateManager.isAuthenticated.collectAsState()

                    if (isAuthenticated) {
                        // Show main tab view with bottom navigation
                        MainTabView(
                            homeRepository = DependencyContainer.getHomeRepository(),
                            reservationRepository = DependencyContainer.getReservationRepository(),
                            authRepository = DependencyContainer.getAuthRepository(),
                            authStateManager = authStateManager
                        )
                    } else {
                        // Show login/onboarding flow
                        val startDestination = Screen.Onboarding.route
                        NavGraph(
                            navController = navController,
                            startDestination = startDestination
                        )
                    }
                }
            }
        }
    }
}

