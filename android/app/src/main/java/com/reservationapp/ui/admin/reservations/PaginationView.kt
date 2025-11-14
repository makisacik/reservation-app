package com.reservationapp.ui.admin.reservations

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.Spacing

@Composable
fun PaginationView(
    currentPage: Int,
    totalPages: Int,
    pageSize: Int,
    onPageChange: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(Spacing.md),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(
            onClick = {
                if (currentPage > 0) {
                    onPageChange(currentPage - 1)
                }
            },
            enabled = currentPage > 0
        ) {
            Icon(
                imageVector = Icons.Default.ChevronLeft,
                contentDescription = "Önceki"
            )
        }

        Text(
            text = "Sayfa ${currentPage + 1} / ${maxOf(totalPages, 1)}",
            style = MaterialTheme.typography.bodyMedium,
            modifier = Modifier.padding(horizontal = Spacing.md)
        )

        IconButton(
            onClick = {
                if (currentPage < totalPages - 1) {
                    onPageChange(currentPage + 1)
                }
            },
            enabled = currentPage < totalPages - 1
        ) {
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = "Sonraki"
            )
        }
    }
}

