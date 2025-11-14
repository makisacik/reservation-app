package com.reservationapp.ui.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.repository.AdminRepository
import com.reservationapp.ui.admin.components.*
import java.text.NumberFormat
import java.util.*

@Composable
fun AdminDashboardScreen(
    adminRepository: AdminRepository,
    viewModel: AdminDashboardViewModel = remember {
        AdminDashboardViewModel(adminRepository)
    }
) {
    val summary by viewModel.summary.collectAsState()
    val popularMeals by viewModel.popularMeals.collectAsState()
    val todayReservations by viewModel.todayReservations.collectAsState()
    val dailySummary by viewModel.dailySummary.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

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
                    text = "Dashboard",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )
                Text(
                    text = "Yemek rezervasyon sistemi genel bakış",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }

            // Top Metrics Cards
            if (summary != null) {
                DashboardStatsGridView(summary = summary!!)
            }

            // Today's Reservations
            TodayReservationsView(
                reservations = todayReservations,
                isLoading = isLoading
            )

            // Popular Menus
            PopularMenusView(
                meals = popularMeals,
                isLoading = isLoading
            )

            // Weekly Summary
            WeeklySummaryView(
                dailyData = dailySummary,
                isLoading = isLoading
            )
        }

        // Loading overlay
        if (isLoading && summary == null) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = PrimaryMain
            )
        }

        // Error message
        errorMessage?.let { error ->
            Snackbar(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(Spacing.md),
                action = {
                    TextButton(onClick = { viewModel.refresh() }) {
                        Text("Tekrar Dene")
                    }
                }
            ) {
                Text(error)
            }
        }
    }
}

@Composable
private fun DashboardStatsGridView(
    summary: com.reservationapp.domain.model.DashboardSummary
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(Spacing.md)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            StatCard(
                title = "Toplam Rezervasyon",
                value = "${summary.totalReservations}",
                icon = Icons.Default.Event,
                iconColor = PrimaryLight,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Aktif Kullanıcı",
                value = "${summary.activeUsers}",
                icon = Icons.Default.People,
                iconColor = PrimaryLight,
                modifier = Modifier.weight(1f)
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            StatCard(
                title = "Bugünkü Yemek",
                value = "${summary.todayMeals}",
                icon = Icons.Default.Restaurant,
                iconColor = PrimaryLight,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Aylık Maliyet",
                value = formatCurrency(summary.monthlyCost),
                icon = Icons.Default.AccountBalance,
                iconColor = PrimaryLight,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

private fun formatCurrency(value: Double): String {
    val formatter = NumberFormat.getCurrencyInstance(Locale("tr", "TR"))
    return formatter.format(value)
}

