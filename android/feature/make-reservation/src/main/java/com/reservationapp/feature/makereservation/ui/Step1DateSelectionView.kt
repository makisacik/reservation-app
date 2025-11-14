package com.reservationapp.feature.makereservation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
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
    val maxSelections = 2
    val dateFormat = remember { java.text.SimpleDateFormat("dd MMMM yyyy", java.util.Locale("tr", "TR")) }
    val today = Calendar.getInstance().apply {
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
    }.timeInMillis

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = BackgroundPaper)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.md),
            verticalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            Text(
                text = "Tarih Seçin (Maksimum 2)",
                style = Typography.titleMedium
            )
            
            // Show selected dates as chips
            if (selectedDates.isNotEmpty()) {
                Column(
                    verticalArrangement = Arrangement.spacedBy(Spacing.sm)
                ) {
                    selectedDates.forEachIndexed { index, date ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Surface(
                                color = PrimaryMain,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = "${index + 1}. ${dateFormat.format(date)}",
                                    modifier = Modifier.padding(horizontal = Spacing.md, vertical = Spacing.sm),
                                    style = Typography.bodyMedium,
                                    color = androidx.compose.ui.graphics.Color.White
                                )
                            }
                            IconButton(
                                onClick = {
                                    val newDates = selectedDates.toMutableList()
                                    newDates.removeAt(index)
                                    onDatesSelected(newDates)
                                }
                            ) {
                                Icon(
                                    imageVector = androidx.compose.material.icons.Icons.Default.Close,
                                    contentDescription = "Kaldır",
                                    tint = ErrorMain
                                )
                            }
                        }
                    }
                }
            }
            
            // Add date button (only if less than max)
            if (selectedDates.size < maxSelections) {
                Button(
                    onClick = { showDatePicker = true },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = selectedDates.size < maxSelections
                ) {
                    Icon(
                        imageVector = androidx.compose.material.icons.Icons.Default.Add,
                        contentDescription = null
                    )
                    Spacer(modifier = Modifier.width(Spacing.sm))
                    Text("Tarih Ekle")
                }
            } else {
                Text(
                    text = "Maksimum 2 tarih seçebilirsiniz",
                    style = Typography.bodySmall,
                    color = TextSecondary,
                    modifier = Modifier.fillMaxWidth()
                )
            }
            
            if (showDatePicker) {
                DatePickerDialog(
                    minDate = today,
                    onDateSelected = { date ->
                        date?.let {
                            val newDate = Date(it)
                            // Check if date is already selected
                            val dateString = dateFormat.format(newDate)
                            val isAlreadySelected = selectedDates.any { 
                                dateFormat.format(it) == dateString 
                            }
                            
                            if (!isAlreadySelected && selectedDates.size < maxSelections) {
                                val newDates = selectedDates.toMutableList()
                                newDates.add(newDate)
                                // Sort dates
                                newDates.sort()
                                onDatesSelected(newDates)
                            }
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
    minDate: Long,
    onDateSelected: (Long?) -> Unit,
    onDismiss: () -> Unit
) {
    val datePickerState = rememberDatePickerState(
        initialSelectedDateMillis = null
    )
    
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
            DatePicker(
                state = datePickerState,
                dateValidator = { dateMillis ->
                    dateMillis >= minDate
                }
            )
        }
    )
}

