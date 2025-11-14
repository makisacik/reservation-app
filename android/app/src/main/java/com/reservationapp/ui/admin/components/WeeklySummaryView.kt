package com.reservationapp.ui.admin.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.horizontalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.BackgroundInactiveTab
import com.reservationapp.core.ui.theme.BackgroundPaper
import com.reservationapp.core.ui.theme.BorderDefault
import com.reservationapp.core.ui.theme.Spacing
import com.reservationapp.core.ui.theme.TextPrimary
import com.reservationapp.core.ui.theme.TextSecondary
import com.reservationapp.core.ui.theme.TextTertiary
import com.reservationapp.domain.model.DailySummary

@Composable
fun WeeklySummaryView(
    dailyData: List<DailySummary>,
    isLoading: Boolean,
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
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            Text(
                text = "Haftalık Rezervasyon Özeti",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary
            )

            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.xl),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(Spacing.md)
                ) {
                    dailyData.forEach { day ->
                        DailySummaryCard(day = day)
                    }
                }
            }
        }
    }
}

@Composable
private fun DailySummaryCard(
    day: DailySummary
) {
    Card(
        modifier = Modifier.width(100.dp),
        colors = CardDefaults.cardColors(
            containerColor = BackgroundInactiveTab
        ),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderDefault)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.md),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(Spacing.xs)
        ) {
            Text(
                text = day.dayAbbreviation,
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextSecondary
            )
            Text(
                text = "${day.reservationCount}",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold
                ),
                color = TextPrimary
            )
            Text(
                text = "Rezervasyon",
                style = MaterialTheme.typography.labelSmall,
                color = TextTertiary
            )
        }
    }
}

