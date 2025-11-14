package com.reservationapp.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.reservationapp.DependencyContainer
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.core.ui.theme.PrimaryMain
import com.reservationapp.domain.repository.AuthRepository
import com.reservationapp.domain.repository.HomeRepository
import com.reservationapp.domain.repository.ReservationRepository
import com.reservationapp.feature.home.ui.HomeScreen
import com.reservationapp.feature.profile.ui.ProfileScreen
import com.reservationapp.feature.reservations.ui.ReservationsScreen

enum class MainTab {
    HOME,
    RESERVATIONS,
    PROFILE
}

@Composable
fun MainTabView(
    homeRepository: HomeRepository,
    reservationRepository: ReservationRepository,
    authRepository: AuthRepository,
    authStateManager: AuthStateManager
) {
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.fillMaxWidth()
            ) {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Ana Sayfa") },
                    label = { Text("Ana Sayfa") },
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryMain,
                        selectedTextColor = PrimaryMain,
                        indicatorColor = MaterialTheme.colorScheme.surface
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Event, contentDescription = "Rezervasyonlar") },
                    label = { Text("Rezervasyonlar") },
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryMain,
                        selectedTextColor = PrimaryMain,
                        indicatorColor = MaterialTheme.colorScheme.surface
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profil") },
                    label = { Text("Profil") },
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryMain,
                        selectedTextColor = PrimaryMain,
                        indicatorColor = MaterialTheme.colorScheme.surface
                    )
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (selectedTab) {
                0 -> HomeScreen(
                    homeRepository = homeRepository,
                    authRepository = authRepository,
                    authStateManager = authStateManager
                )
                1 -> ReservationsScreen(
                    reservationRepository = reservationRepository
                )
                2 -> ProfileScreen(
                    authRepository = authRepository,
                    authStateManager = authStateManager
                )
            }
        }
    }
}

