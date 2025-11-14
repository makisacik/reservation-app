package com.reservationapp.ui.admin.reservations

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.ui.admin.AdminReservationsViewModel
import com.reservationapp.ui.admin.ReservationStatusFilter
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReservationFiltersView(
    viewModel: AdminReservationsViewModel,
    modifier: Modifier = Modifier
) {
    val searchQuery by viewModel.searchQuery.collectAsState()
    val statusFilter by viewModel.statusFilter.collectAsState()
    val dateFrom by viewModel.dateFrom.collectAsState()
    val dateTo by viewModel.dateTo.collectAsState()

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
            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.setSearchQuery(it) },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("İsim, rezervasyon no veya menü ara...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Ara",
                        tint = TextTertiary
                    )
                },
                singleLine = true,
                shape = RoundedCornerShape(8.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = BorderDefault,
                    focusedBorderColor = PrimaryMain
                )
            )

            // Date Range and Status Filter
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.sm),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Date From
                DatePickerButton(
                    label = "Başlangıç",
                    date = dateFrom,
                    onDateSelected = { viewModel.setDateFrom(it) },
                    modifier = Modifier.weight(1f)
                )

                // Date To
                DatePickerButton(
                    label = "Bitiş",
                    date = dateTo,
                    onDateSelected = { viewModel.setDateTo(it) },
                    modifier = Modifier.weight(1f)
                )

                // Status Filter
                var expanded by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(false) }
                Box(modifier = Modifier.weight(1f)) {
                    ExposedDropdownMenuBox(
                        expanded = expanded,
                        onExpandedChange = { expanded = !expanded }
                    ) {
                        OutlinedTextField(
                            value = statusFilter.displayName,
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                unfocusedBorderColor = BorderDefault,
                                focusedBorderColor = PrimaryMain
                            )
                        )
                        ExposedDropdownMenu(
                            expanded = expanded,
                            onDismissRequest = { expanded = false }
                        ) {
                            ReservationStatusFilter.entries.forEach { filter ->
                                DropdownMenuItem(
                                    text = { Text(filter.displayName) },
                                    onClick = {
                                        viewModel.setStatusFilter(filter)
                                        expanded = false
                                    }
                                )
                            }
                        }
                    }
                }
            }

            // Apply Filters Button
            Button(
                onClick = { viewModel.applyFilters() },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = PrimaryMain
                )
            ) {
                Text("Filtrele")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DatePickerButton(
    label: String,
    date: Date?,
    onDateSelected: (Date) -> Unit,
    modifier: Modifier = Modifier
) {
    val dateFormatter = remember { java.text.SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()) }
    var showDatePicker by remember { mutableStateOf(false) }

    OutlinedButton(
        onClick = { showDatePicker = true },
        modifier = modifier,
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = TextPrimary
        )
    ) {
        Text(
            text = date?.let { dateFormatter.format(it) } ?: label,
            style = MaterialTheme.typography.bodyMedium
        )
    }

    if (showDatePicker) {
        val datePickerState = rememberDatePickerState(
            initialSelectedDateMillis = date?.time
        )
        AlertDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        datePickerState.selectedDateMillis?.let {
                            onDateSelected(Date(it))
                        }
                        showDatePicker = false
                    }
                ) {
                    Text("Tamam")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text("İptal")
                }
            },
            text = {
                DatePicker(state = datePickerState)
            }
        )
    }
}

