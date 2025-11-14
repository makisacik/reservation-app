package com.reservationapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.reservationapp.core.ui.theme.ReservationAppTheme
import com.reservationapp.domain.model.User
import com.reservationapp.navigation.NavGraph
import com.reservationapp.navigation.Screen
import com.reservationapp.ui.AdminTabView
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
                    val rememberedAuthStateManager = remember { authStateManager }
                    val isAuthenticated by rememberedAuthStateManager.isAuthenticated.collectAsState()
                    val currentUser by rememberedAuthStateManager.currentUser.collectAsState()

                    // Load user if authenticated but not loaded yet
                    LaunchedEffect(isAuthenticated) {
                        if (isAuthenticated && currentUser == null) {
                            rememberedAuthStateManager.loadCurrentUserIfNeeded()
                        }
                    }

                    if (isAuthenticated) {
                        // Check if user is admin (similar to iOS RootView)
                        val user = currentUser as? User
                        if (user != null) {
                            if (user.isAdmin) {
                                // Show admin tab view
                                AdminTabView(
                                    authRepository = DependencyContainer.getAuthRepository(),
                                    authStateManager = rememberedAuthStateManager
                                )
                            } else {
                                // Show main tab view for regular users
                                MainTabView(
                                    homeRepository = DependencyContainer.getHomeRepository(),
                                    reservationRepository = DependencyContainer.getReservationRepository(),
                                    authRepository = DependencyContainer.getAuthRepository(),
                                    authStateManager = rememberedAuthStateManager
                                )
                            }
                        } else {
                            // User is authenticated but not loaded yet - show loading
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator()
                            }
                        }
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

