package com.reservationapp.ui.admin.components

import androidx.compose.foundation.layout.*
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
import com.reservationapp.core.ui.theme.BackgroundPaper
import com.reservationapp.core.ui.theme.PrimaryLight
import com.reservationapp.core.ui.theme.Spacing
import com.reservationapp.core.ui.theme.TextPrimary
import com.reservationapp.core.ui.theme.TextSecondary
import com.reservationapp.domain.model.TodayReservationGroup

@Composable
fun TodayReservationsView(
    reservations: List<TodayReservationGroup>,
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
                text = "Bugünkü Rezervasyonlar",
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
            } else if (reservations.isEmpty()) {
                Text(
                    text = "Bugün için rezervasyon bulunmamaktadır.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.xl)
                )
            } else {
                reservations.forEach { reservation ->
                    TodayReservationRow(reservation = reservation)
                }
            }
        }
    }
}

@Composable
private fun TodayReservationRow(
    reservation: TodayReservationGroup
) {
        Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = Spacing.sm),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(Spacing.xs)
        ) {
            Text(
                text = getTurkishMealTimeSlotName(reservation.mealTimeSlotName),
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.Medium
                ),
                color = TextPrimary
            )
            Text(
                text = "${formatTimeRange(reservation.startTime, reservation.endTime)} • ${reservation.restaurantName}",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )
        }
        Text(
            text = "${reservation.reservationCount}",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = PrimaryLight
        )
    }
}

private fun getTurkishMealTimeSlotName(englishName: String): String {
    return when (englishName.lowercase()) {
        "breakfast" -> "Kahvaltı"
        "lunch" -> "Öğle Yemeği"
        "dinner" -> "Akşam Yemeği"
        else -> englishName
    }
}

private fun formatTimeRange(start: String, end: String): String {
    // Handle ISO format or simple time format
    val startTime = if (start.contains("T")) {
        start.split("T").lastOrNull()?.take(5) ?: start
    } else {
        start
    }
    val endTime = if (end.contains("T")) {
        end.split("T").lastOrNull()?.take(5) ?: end
    } else {
        end
    }
    return "$startTime-$endTime"
}

