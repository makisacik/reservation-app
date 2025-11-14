package com.reservationapp.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.core.ui.theme.PrimaryMain
import com.reservationapp.domain.repository.AdminRepository
import com.reservationapp.domain.repository.AuthRepository
import com.reservationapp.domain.repository.HomeRepository
import com.reservationapp.ui.admin.*

enum class AdminTab {
    DASHBOARD,
    RESERVATIONS,
    MENU,
    USERS,
    SETTINGS
}

@Composable
fun AdminTabView(
    authRepository: AuthRepository,
    authStateManager: AuthStateManager,
    adminRepository: AdminRepository,
    homeRepository: HomeRepository
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
                    icon = { Icon(Icons.Default.BarChart, contentDescription = "Panel") },
                    label = { Text("Panel") },
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryMain,
                        selectedTextColor = PrimaryMain,
                        indicatorColor = MaterialTheme.colorScheme.surface
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Event, contentDescription = "Rezervasyon") },
                    label = { Text("Rezervasyon") },
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryMain,
                        selectedTextColor = PrimaryMain,
                        indicatorColor = MaterialTheme.colorScheme.surface
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Restaurant, contentDescription = "Menüler") },
                    label = { Text("Menüler") },
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryMain,
                        selectedTextColor = PrimaryMain,
                        indicatorColor = MaterialTheme.colorScheme.surface
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.People, contentDescription = "Kullanıcılar") },
                    label = { Text("Kullanıcılar") },
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryMain,
                        selectedTextColor = PrimaryMain,
                        indicatorColor = MaterialTheme.colorScheme.surface
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Ayarlar") },
                    label = { Text("Ayarlar") },
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4 },
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
                0 -> AdminDashboardScreen(adminRepository = adminRepository)
                1 -> AdminReservationsScreen(adminRepository = adminRepository)
                2 -> AdminMenuScreen(
                    adminRepository = adminRepository,
                    homeRepository = homeRepository
                )
                3 -> AdminUsersScreen()
                4 -> AdminSettingsScreen(
                    authRepository = authRepository,
                    authStateManager = authStateManager
                )
            }
        }
    }
}

