package com.reservationapp.ui.admin.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.ui.admin.AdminSettingsViewModel

@Composable
fun NotificationSettingsView(
    viewModel: AdminSettingsViewModel,
    modifier: Modifier = Modifier
) {
    val notificationSettings by viewModel.notificationSettings.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    var emailEnabled by remember { mutableStateOf((notificationSettings["EmailEnabled"] ?: "false").toBoolean()) }
    var dailyReminderEnabled by remember { mutableStateOf((notificationSettings["DailyReminderEnabled"] ?: "false").toBoolean()) }
    var reminderTime by remember { mutableStateOf(notificationSettings["ReminderTime"] ?: "") }

    LaunchedEffect(notificationSettings) {
        emailEnabled = (notificationSettings["EmailEnabled"] ?: "false").toBoolean()
        dailyReminderEnabled = (notificationSettings["DailyReminderEnabled"] ?: "false").toBoolean()
        reminderTime = notificationSettings["ReminderTime"] ?: ""
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
                text = "Bildirim Ayarları",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary
            )

            SettingSwitchField(
                label = "E-posta Bildirimleri",
                checked = emailEnabled,
                onCheckedChange = { emailEnabled = it },
                description = "Kullanıcılara e-posta bildirimleri gönder"
            )

            SettingSwitchField(
                label = "Günlük Hatırlatma",
                checked = dailyReminderEnabled,
                onCheckedChange = { dailyReminderEnabled = it },
                description = "Kullanıcılara günlük rezervasyon hatırlatması gönder"
            )

            if (dailyReminderEnabled) {
                SettingField(
                    label = "Hatırlatma Saati",
                    value = reminderTime,
                    onValueChange = { reminderTime = it },
                    placeholder = "HH:mm formatında (örn: 09:00)",
                    description = "Günlük hatırlatmanın gönderileceği saat"
                )
            }

            Spacer(modifier = Modifier.height(Spacing.md))

            Button(
                onClick = {
                    val settings = mutableMapOf<String, String>()
                    settings["EmailEnabled"] = emailEnabled.toString()
                    settings["DailyReminderEnabled"] = dailyReminderEnabled.toString()
                    if (dailyReminderEnabled && reminderTime.isNotEmpty()) {
                        settings["ReminderTime"] = reminderTime.trim()
                    }
                    viewModel.updateNotificationSettings(settings)
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

