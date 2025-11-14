package com.reservationapp.ui.admin.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.ui.admin.AdminSettingsViewModel

@Composable
fun ReservationSettingsView(
    viewModel: AdminSettingsViewModel,
    modifier: Modifier = Modifier
) {
    val reservationSettings by viewModel.reservationSettings.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    var maxWeeklyReservations by remember { mutableStateOf(reservationSettings["MaxWeeklyReservations"] ?: "") }
    var maxAdvanceDays by remember { mutableStateOf(reservationSettings["MaxAdvanceReservationDays"] ?: "") }
    var allowPastReservations by remember { mutableStateOf((reservationSettings["AllowPastReservations"] ?: "false").toBoolean()) }
    var cancellationNoticeHours by remember { mutableStateOf(reservationSettings["CancellationNoticeHours"] ?: "") }
    var autoApproval by remember { mutableStateOf((reservationSettings["AutoApproval"] ?: "false").toBoolean()) }
    var allowSameDayReservations by remember { mutableStateOf((reservationSettings["AllowSameDayReservations"] ?: "false").toBoolean()) }

    LaunchedEffect(reservationSettings) {
        maxWeeklyReservations = reservationSettings["MaxWeeklyReservations"] ?: ""
        maxAdvanceDays = reservationSettings["MaxAdvanceReservationDays"] ?: ""
        allowPastReservations = (reservationSettings["AllowPastReservations"] ?: "false").toBoolean()
        cancellationNoticeHours = reservationSettings["CancellationNoticeHours"] ?: ""
        autoApproval = (reservationSettings["AutoApproval"] ?: "false").toBoolean()
        allowSameDayReservations = (reservationSettings["AllowSameDayReservations"] ?: "false").toBoolean()
    }

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
                .verticalScroll(rememberScrollState())
                .padding(Spacing.md),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            Text(
                text = "Rezervasyon Ayarları",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary
            )

            SettingField(
                label = "Haftalık Maksimum Rezervasyon",
                value = maxWeeklyReservations,
                onValueChange = { maxWeeklyReservations = it },
                placeholder = "Örn: 5",
                keyboardType = KeyboardType.Number
            )

            SettingField(
                label = "Maksimum İleri Rezervasyon Günü",
                value = maxAdvanceDays,
                onValueChange = { maxAdvanceDays = it },
                placeholder = "Örn: 30",
                keyboardType = KeyboardType.Number
            )

            SettingField(
                label = "İptal Bildirim Süresi (Saat)",
                value = cancellationNoticeHours,
                onValueChange = { cancellationNoticeHours = it },
                placeholder = "Örn: 24",
                keyboardType = KeyboardType.Number
            )

            Divider()

            SettingSwitchField(
                label = "Geçmiş Rezervasyonlara İzin Ver",
                checked = allowPastReservations,
                onCheckedChange = { allowPastReservations = it },
                description = "Kullanıcıların geçmiş tarihli rezervasyon yapmasına izin ver"
            )

            SettingSwitchField(
                label = "Otomatik Onay",
                checked = autoApproval,
                onCheckedChange = { autoApproval = it },
                description = "Rezervasyonlar otomatik olarak onaylanır"
            )

            SettingSwitchField(
                label = "Aynı Gün Rezervasyonlarına İzin Ver",
                checked = allowSameDayReservations,
                onCheckedChange = { allowSameDayReservations = it },
                description = "Kullanıcılar aynı gün rezervasyon yapabilir"
            )

            Spacer(modifier = Modifier.height(Spacing.md))

            Button(
                onClick = {
                    val settings = mapOf(
                        "MaxWeeklyReservations" to maxWeeklyReservations.trim(),
                        "MaxAdvanceReservationDays" to maxAdvanceDays.trim(),
                        "AllowPastReservations" to allowPastReservations.toString(),
                        "CancellationNoticeHours" to cancellationNoticeHours.trim(),
                        "AutoApproval" to autoApproval.toString(),
                        "AllowSameDayReservations" to allowSameDayReservations.toString()
                    )
                    viewModel.updateReservationSettings(settings)
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = !isLoading,
                colors = ButtonDefaults.buttonColors(
                    containerColor = PrimaryMain
                )
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        color = androidx.compose.ui.graphics.Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("Kaydet")
                }
            }
        }
    }
}

