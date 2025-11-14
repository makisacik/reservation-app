package com.reservationapp.ui.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.repository.AdminRepository
import com.reservationapp.ui.admin.reservations.PaginationView
import com.reservationapp.ui.admin.users.*
import kotlinx.coroutines.delay

@Composable
fun AdminUsersScreen(
    adminRepository: AdminRepository,
    viewModel: AdminUsersViewModel = remember {
        AdminUsersViewModel(adminRepository)
    }
) {
    val users by viewModel.users.collectAsState()
    val statistics by viewModel.statistics.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val successMessage by viewModel.successMessage.collectAsState()
    val currentPage by viewModel.currentPage.collectAsState()
    val totalCount by viewModel.totalCount.collectAsState()
    val pageSize by viewModel.pageSize.collectAsState()
    val showUserForm by viewModel.showUserForm.collectAsState()
    val showDeleteConfirmation by viewModel.showDeleteConfirmation.collectAsState()
    val userToDelete by viewModel.userToDelete.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val statusFilter by viewModel.statusFilter.collectAsState()
    val roleFilter by viewModel.roleFilter.collectAsState()
    val departmentFilter by viewModel.departmentFilter.collectAsState()

    val totalPages = (totalCount + pageSize - 1) / pageSize
    val hasFilters = searchQuery.isNotEmpty() ||
            statusFilter != UserStatusFilter.ALL ||
            roleFilter != UserRoleFilter.ALL ||
            departmentFilter.isNotEmpty()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPage)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(Spacing.md),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            // Header
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(Spacing.xs)
            ) {
                Text(
                    text = "Kullanıcı Yönetimi",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )
                Text(
                    text = "Tüm kullanıcıları görüntüleyin ve yönetin",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }

            // Statistics Cards
            UserStatisticsCardsView(
                statistics = statistics,
                isLoading = isLoading
            )

            // Filters
            UserFiltersView(viewModel = viewModel)

            // Users List
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                Text(
                    text = "Kullanıcı Listesi",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )

                if (isLoading && users.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(Spacing.xl),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = PrimaryMain)
                    }
                } else if (users.isEmpty()) {
                    EmptyUsersView(hasFilters = hasFilters)
                } else {
                    users.forEach { user ->
                        UserRowView(
                            user = user,
                            onEdit = {
                                viewModel.openEditForm(user)
                            },
                            onDelete = {
                                viewModel.confirmDelete(user)
                            }
                        )
                    }

                    // Pagination
                    PaginationView(
                        currentPage = currentPage - 1, // Convert to 0-based for PaginationView
                        totalPages = totalPages,
                        pageSize = pageSize,
                        onPageChange = { page ->
                            viewModel.setPage(page + 1) // Convert back to 1-based
                        }
                    )
                }
            }
        }

        // Loading overlay
        if (isLoading && users.isNotEmpty()) {
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

        // User Form Modal
        UserFormView(
            isPresented = showUserForm,
            viewModel = viewModel,
            onDismiss = { viewModel.hideUserForm() }
        )

        // Delete Confirmation Dialog
        if (showDeleteConfirmation && userToDelete != null) {
            AlertDialog(
                onDismissRequest = { viewModel.hideDeleteConfirmation() },
                title = {
                    Text("Kullanıcı Silme")
                },
                text = {
                    Text("${userToDelete!!.name} kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            viewModel.deleteUser(userToDelete!!)
                        }
                    ) {
                        Text("Sil", color = ErrorMain)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.hideDeleteConfirmation() }) {
                        Text("İptal")
                    }
                }
            )
        }
    }
}
