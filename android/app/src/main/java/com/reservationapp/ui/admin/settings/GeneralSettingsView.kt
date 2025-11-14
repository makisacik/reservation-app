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
fun GeneralSettingsView(
    viewModel: AdminSettingsViewModel,
    modifier: Modifier = Modifier
) {
    val generalSettings by viewModel.generalSettings.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    var companyName by remember { mutableStateOf(generalSettings["CompanyName"] ?: "") }
    var timezone by remember { mutableStateOf(generalSettings["Timezone"] ?: "") }

    LaunchedEffect(generalSettings) {
        companyName = generalSettings["CompanyName"] ?: ""
        timezone = generalSettings["Timezone"] ?: ""
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
                text = "Genel Ayarlar",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary
            )

            SettingField(
                label = "Şirket Adı",
                value = companyName,
                onValueChange = { companyName = it },
                placeholder = "Şirket adını giriniz"
            )

            SettingField(
                label = "Saat Dilimi",
                value = timezone,
                onValueChange = { timezone = it },
                placeholder = "Örn: Europe/Istanbul"
            )

            Spacer(modifier = Modifier.height(Spacing.md))

            Button(
                onClick = {
                    val settings = mapOf(
                        "CompanyName" to companyName.trim(),
                        "Timezone" to timezone.trim()
                    )
                    viewModel.updateGeneralSettings(settings)
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

