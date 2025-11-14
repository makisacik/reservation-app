package com.reservationapp.ui.admin.menu

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.ui.admin.CategoryTab

@Composable
fun MenuCategoryTabsView(
    selectedTab: CategoryTab,
    onTabSelected: (CategoryTab) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = Spacing.md),
        horizontalArrangement = Arrangement.spacedBy(Spacing.sm)
    ) {
        CategoryTab.entries.forEach { tab ->
            MenuCategoryTabButton(
                title = tab.displayName,
                isSelected = selectedTab == tab,
                onClick = {
                    onTabSelected(tab)
                }
            )
        }
    }
}

@Composable
private fun MenuCategoryTabButton(
    title: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    if (isSelected) {
        Button(
            onClick = onClick,
            modifier = Modifier.clip(RoundedCornerShape(8.dp)),
            colors = ButtonDefaults.buttonColors(
                containerColor = BackgroundActiveTab,
                contentColor = PrimaryMain
            ),
            contentPadding = PaddingValues(horizontal = Spacing.lg, vertical = Spacing.md)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.SemiBold
                )
            )
        }
    } else {
        OutlinedButton(
            onClick = onClick,
            modifier = Modifier.clip(RoundedCornerShape(8.dp)),
            colors = ButtonDefaults.outlinedButtonColors(
                contentColor = TextSecondary
            ),
            border = androidx.compose.foundation.BorderStroke(1.dp, BorderDefault),
            contentPadding = PaddingValues(horizontal = Spacing.lg, vertical = Spacing.md)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.Normal
                )
            )
        }
    }
}

