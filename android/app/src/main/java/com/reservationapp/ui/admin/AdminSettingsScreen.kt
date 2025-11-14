package com.reservationapp.ui.admin

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.domain.repository.AuthRepository

@Composable
@Suppress("UNUSED_PARAMETER")
fun AdminSettingsScreen(
    authRepository: AuthRepository,
    authStateManager: AuthStateManager
) {
    // Parameters are reserved for future implementation
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "Admin Ayarlar",
                style = MaterialTheme.typography.headlineMedium
            )
            Text(
                text = "Ayarlar yakında eklenecek",
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center
            )
        }
    }
}

