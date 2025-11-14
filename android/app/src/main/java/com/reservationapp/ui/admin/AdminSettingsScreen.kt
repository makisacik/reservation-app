package com.reservationapp.ui.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.repository.AdminRepository
import com.reservationapp.domain.repository.AuthRepository
import com.reservationapp.ui.admin.settings.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import androidx.compose.runtime.rememberCoroutineScope

@Composable
fun AdminSettingsScreen(
    adminRepository: AdminRepository,
    authRepository: AuthRepository,
    authStateManager: AuthStateManager,
    viewModel: AdminSettingsViewModel = remember {
        AdminSettingsViewModel(adminRepository)
    }
) {
    val selectedTab by viewModel.selectedTab.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val successMessage by viewModel.successMessage.collectAsState()
    
    var showLogoutConfirmation by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPage)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(Spacing.md),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            // Header
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(Spacing.xs)
            ) {
                Text(
                    text = "Ayarlar",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )
                Text(
                    text = "Sistem ayarlarını yönetin ve yapılandırın",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }

            // Tabs
            SettingsTabsView(
                selectedTab = selectedTab,
                onTabSelected = { viewModel.setSelectedTab(it) }
            )

            // Settings Content
            when (selectedTab) {
                SettingsTab.GENERAL -> {
                    GeneralSettingsView(viewModel = viewModel)
                }
                SettingsTab.RESERVATION -> {
                    ReservationSettingsView(viewModel = viewModel)
                }
                SettingsTab.NOTIFICATIONS -> {
                    NotificationSettingsView(viewModel = viewModel)
                }
            }

            // Logout Button
            Spacer(modifier = Modifier.height(Spacing.lg))
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = BackgroundPaper
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Button(
                    onClick = { showLogoutConfirmation = true },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.md),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = ErrorMain
                    )
                ) {
                    Text("Çıkış Yap")
                }
            }
        }

        // Loading overlay
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = PrimaryMain
            )
        }

        // Error message
        errorMessage?.let { error ->
            LaunchedEffect(error) {
                // Show snackbar
            }
            Snackbar(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(Spacing.md),
                action = {
                    TextButton(onClick = { viewModel.clearErrorMessage() }) {
                        Text("Tamam")
                    }
                }
            ) {
                Text(error)
            }
        }

        // Success message
        successMessage?.let { success ->
            LaunchedEffect(success) {
                // Auto dismiss after 3 seconds
                delay(3000)
                viewModel.clearSuccessMessage()
            }
            Snackbar(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(Spacing.md),
                action = {
                    TextButton(onClick = { viewModel.clearSuccessMessage() }) {
                        Text("Tamam")
                    }
                }
            ) {
                Text(success)
            }
        }

        // Logout Confirmation Dialog
        if (showLogoutConfirmation) {
            AlertDialog(
                onDismissRequest = { showLogoutConfirmation = false },
                title = {
                    Text(
                        text = "Çıkış Yap",
                        style = MaterialTheme.typography.titleLarge
                    )
                },
                text = {
                    Text(
                        text = "Çıkış yapmak istediğinizden emin misiniz?",
                        style = MaterialTheme.typography.bodyMedium
                    )
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            showLogoutConfirmation = false
                            // Perform logout
                            coroutineScope.launch {
                                authRepository.logout()
                                authStateManager.clearUser()
                            }
                        }
                    ) {
                        Text(
                            text = "Çıkış Yap",
                            color = ErrorMain
                        )
                    }
                },
                dismissButton = {
                    TextButton(
                        onClick = { showLogoutConfirmation = false }
                    ) {
                        Text("İptal")
                    }
                }
            )
        }
    }
}
