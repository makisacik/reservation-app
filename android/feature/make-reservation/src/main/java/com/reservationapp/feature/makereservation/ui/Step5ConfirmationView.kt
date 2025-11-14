package com.reservationapp.feature.makereservation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.feature.makereservation.viewmodel.MakeReservationViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun Step5ConfirmationView(
    viewModel: MakeReservationViewModel,
    onSubmit: () -> Unit
) {
    val selectedDates by viewModel.selectedDates.collectAsState()
    val selectedMealTimeSlot by viewModel.selectedMealTimeSlot.collectAsState()
    val selectedRestaurant by viewModel.selectedRestaurant.collectAsState()
    val selectedMenuType by viewModel.selectedMenuType.collectAsState()
    val selectedMeal by viewModel.selectedMeal.collectAsState()
    val appetizer by viewModel.appetizer.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(Spacing.lg)
    ) {
        Text(
            text = "Rezervasyon Özeti",
            style = Typography.titleLarge
        )

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
                ConfirmationRow("Tarih", formatDate(selectedDates.firstOrNull()))
                selectedMealTimeSlot?.let { slot ->
                    ConfirmationRow(
                        "Öğün",
                        "${slot.turkishName ?: slot.name} (${slot.formattedTimeRange ?: "${slot.startTime}-${slot.endTime}"})"
                    )
                }
                selectedRestaurant?.let { restaurant ->
                    ConfirmationRow("Restoran", restaurant.name)
                }
                selectedMenuType?.let { menuType ->
                    ConfirmationRow("Menü Tipi", getMenuTypeDisplayName(menuType))
                }
                ConfirmationRow("Seçilen Menü", selectedMeal?.name ?: "Menü seçilmedi")
                if (appetizer) {
                    ConfirmationRow("Aparetif Talebi", "Mevsim meze tabağı")
                }
            }
        }

        Spacer(modifier = Modifier.height(Spacing.md))

        Button(
            onClick = onSubmit,
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading,
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryMain)
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = androidx.compose.ui.graphics.Color.White
                )
                Spacer(modifier = Modifier.width(Spacing.sm))
            }
            Text(
                text = if (isLoading) "Oluşturuluyor..." else "Rezervasyonu Onayla",
                style = Typography.labelLarge
            )
        }
    }
}

@Composable
fun ConfirmationRow(label: String, value: String?) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = "$label:",
            style = Typography.bodyMedium,
            color = TextSecondary
        )
        Text(
            text = value ?: "-",
            style = Typography.bodyMedium,
            color = TextPrimary,
            fontWeight = androidx.compose.ui.text.font.FontWeight.Medium
        )
    }
}

private fun formatDate(date: Date?): String {
    if (date == null) return "-"
    val format = SimpleDateFormat("dd MMMM yyyy", Locale("tr", "TR"))
    return format.format(date)
}

private fun getMenuTypeDisplayName(menuType: com.reservationapp.domain.model.MenuType): String {
    return when (menuType) {
        com.reservationapp.domain.model.MenuType.STANDARD -> "Standart Menü"
        com.reservationapp.domain.model.MenuType.SPECIAL -> "Özel Menü"
    }
}

