package com.reservationapp.feature.profile.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.repository.AuthRepository
import com.reservationapp.feature.profile.viewmodel.ProfileViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    authRepository: AuthRepository,
    authStateManager: AuthStateManager,
    viewModel: ProfileViewModel = remember {
        ProfileViewModel(
            authRepository = authRepository,
            authStateManager = authStateManager
        )
    }
) {
    val currentUser by viewModel.currentUser.collectAsState()
    val name by viewModel.name.collectAsState()
    val email by viewModel.email.collectAsState()
    val department by viewModel.department.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val successMessage by viewModel.successMessage.collectAsState()
    var showLogoutConfirmation by remember { mutableStateOf(false) }

    // Clear messages after a delay
    LaunchedEffect(errorMessage, successMessage) {
        if (errorMessage != null || successMessage != null) {
            kotlinx.coroutines.delay(5000)
            viewModel.clearMessages()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Profil") },
                actions = {
                    TextButton(
                        onClick = { showLogoutConfirmation = true }
                    ) {
                        Text(
                            text = "Çıkış",
                            color = ErrorMain
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(paddingValues)
                .padding(Spacing.md)
        ) {
        // Header
        ProfileHeaderView(user = currentUser)

        Spacer(modifier = Modifier.height(Spacing.lg))

        // Error/Success Messages
        errorMessage?.let { error ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = ErrorMain.copy(alpha = 0.1f))
            ) {
                Text(
                    text = error,
                    style = Typography.bodyMedium,
                    color = ErrorMain,
                    modifier = Modifier.padding(Spacing.md)
                )
            }
            Spacer(modifier = Modifier.height(Spacing.md))
        }

        successMessage?.let { success ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SuccessMain.copy(alpha = 0.1f))
            ) {
                Text(
                    text = success,
                    style = Typography.bodyMedium,
                    color = SuccessMain,
                    modifier = Modifier.padding(Spacing.md)
                )
            }
            Spacer(modifier = Modifier.height(Spacing.md))
        }

        // Profile Form
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = BackgroundPaper)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.md),
                verticalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                Text(
                    text = "Profil Bilgileri",
                    style = Typography.titleLarge,
                    color = TextPrimary
                )

                OutlinedTextField(
                    value = name,
                    onValueChange = { viewModel.name.value = it },
                    label = { Text("İsim") },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = !isLoading,
                    singleLine = true
                )

                OutlinedTextField(
                    value = email,
                    onValueChange = { viewModel.email.value = it },
                    label = { Text("Email") },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = !isLoading,
                    singleLine = true
                )

                OutlinedTextField(
                    value = department ?: "",
                    onValueChange = { viewModel.department.value = it.ifEmpty { null } },
                    label = { Text("Departman") },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = !isLoading,
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(Spacing.md))

                // Action Buttons - Cancel and Update side by side
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                ) {
                    // Cancel Button (Secondary)
                    OutlinedButton(
                        onClick = { viewModel.resetForm() },
                        modifier = Modifier.weight(1f),
                        enabled = !isLoading
                    ) {
                        Text(
                            text = "İptal",
                            style = Typography.labelLarge
                        )
                    }

                    // Update Button (Primary)
                    Button(
                        onClick = { viewModel.updateProfile() },
                        modifier = Modifier.weight(1f),
                        enabled = !isLoading && name.isNotEmpty() && email.isNotEmpty(),
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryMain)
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = androidx.compose.ui.graphics.Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text(
                                text = "Kaydet",
                                style = Typography.labelLarge
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(Spacing.lg))

        // User Info Card
        currentUser?.let { user ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = BackgroundPaper)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.md),
                    verticalArrangement = Arrangement.spacedBy(Spacing.sm)
                ) {
                    Text(
                        text = "Hesap Bilgileri",
                        style = Typography.titleMedium,
                        color = TextPrimary
                    )

                    InfoRow(label = "Rol", value = user.role)
                    user.status?.let { status ->
                        InfoRow(label = "Durum", value = status)
                    }
                    user.totalReservations?.let { total ->
                        InfoRow(label = "Toplam Rezervasyon", value = total.toString())
                    }
                }
            }
        }
    }

        // Logout Confirmation Dialog
        if (showLogoutConfirmation) {
            AlertDialog(
                onDismissRequest = { showLogoutConfirmation = false },
                title = {
                    Text(
                        text = "Çıkış Yap",
                        style = Typography.titleLarge
                    )
                },
                text = {
                    Text(
                        text = "Çıkış yapmak istediğinizden emin misiniz?",
                        style = Typography.bodyMedium
                    )
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            showLogoutConfirmation = false
                            viewModel.logout()
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
                        Text(
                            text = "İptal",
                            style = Typography.labelLarge
                        )
                    }
                }
            )
        }
    }
}

@Composable
fun ProfileHeaderView(user: com.reservationapp.domain.model.User?) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = BackgroundPaper)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.md),
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = null,
                modifier = Modifier.size(48.dp),
                tint = PrimaryMain
            )
            Spacer(modifier = Modifier.width(Spacing.md))
            Column {
                Text(
                    text = user?.name ?: "Kullanıcı",
                    style = Typography.titleLarge,
                    color = TextPrimary
                )
                user?.email?.let { email ->
                    Text(
                        text = email,
                        style = Typography.bodyMedium,
                        color = TextSecondary
                    )
                }
            }
        }
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = Typography.bodyMedium,
            color = TextSecondary
        )
        Text(
            text = value,
            style = Typography.bodyMedium,
            color = TextPrimary
        )
    }
}

