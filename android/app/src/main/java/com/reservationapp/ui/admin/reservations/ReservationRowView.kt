package com.reservationapp.ui.admin.reservations

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.Reservation
import com.reservationapp.ui.admin.components.StatusBadge
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ReservationRowView(
    reservation: Reservation,
    onDetailTap: () -> Unit,
    onApproveTap: (() -> Unit)?,
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
                .padding(Spacing.md),
            verticalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(Spacing.xs)
                ) {
                    // Reservation Number
                    Text(
                        text = reservation.reservationNumber,
                        style = MaterialTheme.typography.bodyLarge.copy(
                            fontWeight = FontWeight.Medium
                        ),
                        color = TextPrimary
                    )

                    // User Name
                    Text(
                        text = reservation.userName,
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )

                    // Date and Time Slot
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(Spacing.sm),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.CalendarToday,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = TextSecondary
                        )
                        Text(
                            text = formatDate(reservation.date),
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )

                        Spacer(modifier = Modifier.width(Spacing.sm))

                        Icon(
                            imageVector = Icons.Default.Schedule,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = TextSecondary
                        )
                        Text(
                            text = getTurkishMealTimeSlotName(reservation.mealTimeSlotName),
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                    }

                    // Restaurant and Menu
                    Text(
                        text = "${reservation.restaurantName} • ${reservation.menuName.takeIf { it.isNotEmpty() } ?: "Menü"}",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextTertiary
                    )
                }

                Column(
                    horizontalAlignment = Alignment.End,
                    verticalArrangement = Arrangement.spacedBy(Spacing.sm)
                ) {
                    // Status Badge
                    StatusBadge(status = reservation.status)

                    // Actions
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(Spacing.sm)
                    ) {
                        TextButton(onClick = onDetailTap) {
                            Text(
                                text = "Detay",
                                style = MaterialTheme.typography.labelSmall,
                                color = PrimaryMain
                            )
                        }

                        if (isPending(reservation.status) && onApproveTap != null) {
                            Button(
                                onClick = onApproveTap,
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = InfoMain
                                ),
                                modifier = Modifier.height(28.dp),
                                contentPadding = PaddingValues(horizontal = Spacing.sm, vertical = Spacing.xs)
                            ) {
                                Text(
                                    text = "Onayla",
                                    style = MaterialTheme.typography.labelSmall
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun formatDate(dateString: String): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val outputFormat = SimpleDateFormat("d MMMM yyyy", Locale("tr", "TR"))
        val date = inputFormat.parse(dateString) ?: return dateString
        outputFormat.format(date)
    } catch (e: Exception) {
        dateString
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

private fun isPending(status: String): Boolean {
    return status.lowercase() == "pending" || status == "3"
}

