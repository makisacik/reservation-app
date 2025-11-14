package com.reservationapp.ui.admin.reservations

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.ReservationSummary

@Composable
fun ReservationSummaryCardsView(
    summary: ReservationSummary?,
    isLoading: Boolean,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(Spacing.md)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            SummaryCard(
                title = "Bugün",
                value = summary?.todayCount ?: 0,
                isLoading = isLoading,
                modifier = Modifier.weight(1f)
            )
            SummaryCard(
                title = "Bu Hafta",
                value = summary?.thisWeekCount ?: 0,
                isLoading = isLoading,
                modifier = Modifier.weight(1f)
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            SummaryCard(
                title = "Bu Ay",
                value = summary?.thisMonthCount ?: 0,
                isLoading = isLoading,
                color = SuccessMain,
                modifier = Modifier.weight(1f)
            )
            SummaryCard(
                title = "Beklemede",
                value = summary?.pendingCount ?: 0,
                isLoading = isLoading,
                color = WarningMain,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun SummaryCard(
    title: String,
    value: Int,
    isLoading: Boolean,
    color: Color = PrimaryMain,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = BackgroundPaper
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.xs)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary
            )

            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(32.dp),
                    color = color
                )
            } else {
                Text(
                    text = "$value",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = color
                )
            }
        }
    }
}

