package com.reservationapp.core.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.PrimaryMain
import com.reservationapp.core.ui.theme.Spacing
import com.reservationapp.core.ui.theme.Typography

@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = Spacing.md),
        enabled = enabled,
        colors = ButtonDefaults.buttonColors(
            containerColor = PrimaryMain
        )
    ) {
        Text(
            text = text,
            style = Typography.labelLarge
        )
    }
}

