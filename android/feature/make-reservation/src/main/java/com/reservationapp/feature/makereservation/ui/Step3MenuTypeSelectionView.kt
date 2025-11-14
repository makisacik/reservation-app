package com.reservationapp.feature.makereservation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.MenuType

@Composable
fun Step3MenuTypeSelectionView(
    selectedMenuType: MenuType?,
    onMenuTypeSelected: (MenuType) -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(Spacing.lg)
    ) {
        Text(
            text = "Menü Tipi Seçimi",
            style = Typography.titleLarge
        )

        Text(
            text = "Lütfen bir menü tipi seçin",
            style = Typography.bodyMedium,
            color = TextSecondary
        )

        MenuType.values().forEach { menuType ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = Spacing.xs),
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
            ) {
                RadioButton(
                    selected = selectedMenuType == menuType,
                    onClick = { onMenuTypeSelected(menuType) }
                )
                Spacer(modifier = Modifier.width(Spacing.sm))
                Text(
                    text = getMenuTypeDisplayName(menuType),
                    style = Typography.bodyMedium
                )
            }
        }
    }
}

private fun getMenuTypeDisplayName(menuType: MenuType): String {
    return when (menuType) {
        MenuType.STANDARD -> "Standart Menü"
        MenuType.SPECIAL -> "Özel Menü"
    }
}

