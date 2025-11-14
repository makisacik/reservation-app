package com.reservationapp.ui.admin.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.reservationapp.core.ui.theme.*

@Composable
fun StatusBadge(
    status: String,
    modifier: Modifier = Modifier
) {
    val (text, color) = when (status.lowercase()) {
        "pending", "3" -> "Beklemede" to WarningMain
        "active", "1" -> "Onaylandı" to SuccessMain
        "cancelled", "2" -> "İptal" to ErrorMain
        else -> "Bilinmiyor" to TextSecondary
    }

    Text(
        text = text,
        modifier = modifier
            .padding(horizontal = 8.dp, vertical = 4.dp),
        color = color,
        fontSize = 12.sp,
        fontWeight = FontWeight.Medium
    )
}

