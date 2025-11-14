package com.reservationapp.feature.makereservation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.MealTimeSlot
import java.util.*

@Composable
fun Step1DateSelectionView(
    selectedDates: List<Date>,
    onDatesSelected: (List<Date>) -> Unit,
    mealTimeSlots: List<MealTimeSlot>,
    selectedMealTimeSlot: MealTimeSlot?,
    onMealTimeSlotSelected: (MealTimeSlot) -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(Spacing.lg)
    ) {
        Text(
            text = "Tarih ve Öğün Seçimi",
            style = Typography.titleLarge
        )

        // Calendar/Date Picker
        // Note: Use Material DatePicker or custom calendar
        DatePickerSection(
            selectedDates = selectedDates,
            onDatesSelected = onDatesSelected
        )

        // Meal Time Slot Selection
        Text(
            text = "Öğün Seçin",
            style = Typography.titleMedium
        )

        mealTimeSlots.forEach { slot ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = Spacing.xs),
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
            ) {
                RadioButton(
                    selected = selectedMealTimeSlot?.id == slot.id,
                    onClick = { onMealTimeSlotSelected(slot) }
                )
                Spacer(modifier = Modifier.width(Spacing.sm))
                Text(
                    text = "${slot.turkishName ?: slot.name} (${slot.formattedTimeRange ?: "${slot.startTime}-${slot.endTime}"})",
                    style = Typography.bodyMedium
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DatePickerSection(
    selectedDates: List<Date>,
    onDatesSelected: (List<Date>) -> Unit
) {
    var showDatePicker by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = BackgroundPaper)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.md)
        ) {
            Text(
                text = "Tarih Seçin",
                style = Typography.titleMedium
            )
            Spacer(modifier = Modifier.height(Spacing.sm))
            
            Button(
                onClick = { showDatePicker = true },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = if (selectedDates.isNotEmpty()) {
                        val dateFormat = java.text.SimpleDateFormat("dd MMMM yyyy", java.util.Locale("tr", "TR"))
                        dateFormat.format(selectedDates.first())
                    } else {
                        "Tarih Seç"
                    }
                )
            }
            
            if (showDatePicker) {
                DatePickerDialog(
                    onDateSelected = { date ->
                        date?.let {
                            onDatesSelected(listOf(Date(it)))
                            showDatePicker = false
                        }
                    },
                    onDismiss = { showDatePicker = false }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DatePickerDialog(
    onDateSelected: (Long?) -> Unit,
    onDismiss: () -> Unit
) {
    val datePickerState = rememberDatePickerState()
    
    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            TextButton(onClick = {
                onDateSelected(datePickerState.selectedDateMillis)
            }) {
                Text("Seç")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("İptal")
            }
        },
        text = {
            DatePicker(state = datePickerState)
        }
    )
}

