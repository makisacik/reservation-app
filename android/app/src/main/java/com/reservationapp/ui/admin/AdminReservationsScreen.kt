package com.reservationapp.ui.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.repository.AdminRepository
import com.reservationapp.ui.admin.reservations.*
import kotlinx.coroutines.delay

@Composable
fun AdminReservationsScreen(
    adminRepository: AdminRepository,
    viewModel: AdminReservationsViewModel = remember {
        AdminReservationsViewModel(adminRepository)
    }
) {
    val reservations by viewModel.reservations.collectAsState()
    val summary by viewModel.summary.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val successMessage by viewModel.successMessage.collectAsState()
    val currentPage by viewModel.currentPage.collectAsState()
    val totalCount by viewModel.totalCount.collectAsState()
    val pageSize by viewModel.pageSize.collectAsState()
    val showApprovalDialog by viewModel.showApprovalDialog.collectAsState()
    val reservationToApprove by viewModel.reservationToApprove.collectAsState()

    val totalPages = (totalCount + pageSize - 1) / pageSize

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
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(Spacing.xs)
                ) {
                    Text(
                        text = "Rezervasyonlar",
                        style = MaterialTheme.typography.headlineSmall.copy(
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = TextPrimary
                    )
                    Text(
                        text = "Tüm rezervasyonları görüntüleyin ve yönetin",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )
                }

                Button(
                    onClick = { viewModel.showCreateModal() },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrimaryMain
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(Spacing.xs))
                    Text("Rezervasyon")
                }
            }

            // Filters
            ReservationFiltersView(viewModel = viewModel)

            // Summary Cards
            ReservationSummaryCardsView(
                summary = summary,
                isLoading = isLoading
            )

            // Reservations List
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                Text(
                    text = "Rezervasyon Listesi",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )

                if (isLoading && reservations.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(Spacing.xl),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = PrimaryMain)
                    }
                } else if (reservations.isEmpty()) {
                    EmptyReservationsView()
                } else {
                    reservations.forEach { reservation ->
                        ReservationRowView(
                            reservation = reservation,
                            onDetailTap = {
                                viewModel.showDetailModal(reservation.id)
                            },
                            onApproveTap = {
                                viewModel.showApprovalDialog(reservation)
                            }
                        )
                    }

                    // Pagination
                    PaginationView(
                        currentPage = currentPage,
                        totalPages = totalPages,
                        pageSize = pageSize,
                        onPageChange = { page ->
                            viewModel.changePage(page)
                        }
                    )
                }
            }
        }

        // Loading overlay
        if (isLoading && reservations.isNotEmpty()) {
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
                kotlinx.coroutines.delay(3000)
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

        // Approval Dialog
        if (showApprovalDialog && reservationToApprove != null) {
            AlertDialog(
                onDismissRequest = { viewModel.hideApprovalDialog() },
                title = {
                    Text("Rezervasyon Onaylama")
                },
                text = {
                    Text("Rezervasyon No: ${reservationToApprove!!.reservationNumber} onaylanacak. Onaylamak istiyor musunuz?")
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            viewModel.approveReservation(reservationToApprove!!)
                        }
                    ) {
                        Text("Onayla")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.hideApprovalDialog() }) {
                        Text("İptal")
                    }
                }
            )
        }
    }
}

