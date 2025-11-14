package com.reservationapp.feature.reservations.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.Reservation
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ReservationCard(
    reservation: Reservation,
    mealName: String
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = Spacing.md),
        colors = CardDefaults.cardColors(containerColor = BackgroundPaper),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        shape = RoundedCornerShape(8.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.lg)
        ) {
            // Status Badge (top right)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                StatusBadge(status = reservation.status)
            }

            Spacer(modifier = Modifier.height(Spacing.md))

            // Meal Name
            Text(
                text = mealName,
                style = Typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = PrimaryMain,
                modifier = Modifier.padding(bottom = Spacing.xs)
            )

            // Restaurant Name
            Text(
                text = reservation.restaurantName,
                style = Typography.bodySmall,
                color = TextTertiary,
                modifier = Modifier.padding(bottom = Spacing.md)
            )

            // Date Row
            InfoRow(
                icon = Icons.Default.Event,
                text = formatDate(reservation.date)
            )

            Spacer(modifier = Modifier.height(Spacing.xs))

            // Time Slot Row
            InfoRow(
                icon = Icons.Default.AccessTime,
                text = reservation.mealTimeSlotName
            )

            Spacer(modifier = Modifier.height(Spacing.xs))

            // Location Row
            InfoRow(
                icon = Icons.Default.LocationOn,
                text = reservation.restaurantName
            )
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val (displayName, color) = when (status.uppercase()) {
        "PENDING" -> "Beklemede" to InfoMain
        "ACTIVE" -> "Onaylandı" to PrimaryMain
        "CANCELLED" -> "İptal Edildi" to TextSecondary
        else -> status to TextSecondary
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(4.dp))
            .background(color)
            .padding(horizontal = Spacing.sm, vertical = Spacing.xs),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = displayName,
            style = Typography.labelSmall,
            fontWeight = FontWeight.Medium,
            color = androidx.compose.ui.graphics.Color.White
        )
    }
}

@Composable
fun InfoRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Start
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(16.dp),
            tint = TextSecondary
        )
        Spacer(modifier = Modifier.width(Spacing.sm))
        Text(
            text = text,
            style = Typography.bodySmall,
            color = TextPrimary
        )
    }
}

private fun formatDate(dateString: String): String {
    return try {
        // Try multiple ISO 8601 formats
        val formats = listOf(
            SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()),
            SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()),
            SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault()),
            SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        )
        formats.forEach { it.timeZone = TimeZone.getTimeZone("UTC") }
        
        var date: Date? = null
        for (format in formats) {
            try {
                date = format.parse(dateString)
                break
            } catch (e: Exception) {
                // Try next format
            }
        }
        
        if (date == null) return dateString

        // Format as Turkish date
        val outputFormat = SimpleDateFormat("d MMMM yyyy", Locale("tr", "TR"))
        outputFormat.format(date)
    } catch (e: Exception) {
        dateString // Fallback to original string
    }
}

