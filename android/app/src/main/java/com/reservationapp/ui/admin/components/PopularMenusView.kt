package com.reservationapp.ui.admin.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.BackgroundPaper
import com.reservationapp.core.ui.theme.PrimaryLight
import com.reservationapp.core.ui.theme.Spacing
import com.reservationapp.core.ui.theme.TextPrimary
import com.reservationapp.core.ui.theme.TextSecondary
import com.reservationapp.domain.model.PopularMeal

@Composable
fun PopularMenusView(
    meals: List<PopularMeal>,
    isLoading: Boolean,
    modifier: Modifier = Modifier
) {
    val maxCount = meals.maxOfOrNull { it.reservationCount } ?: 1

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
                .padding(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            Text(
                text = "En Popüler Menüler",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary
            )

            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.xl),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else if (meals.isEmpty()) {
                Text(
                    text = "Henüz popüler menü bulunmamaktadır.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.xl)
                )
            } else {
                meals.forEach { meal ->
                    PopularMealRow(
                        meal = meal,
                        maxCount = maxCount
                    )
                }
            }
        }
    }
}

@Composable
private fun PopularMealRow(
    meal: PopularMeal,
    maxCount: Int
) {
    val progress = meal.reservationCount.toFloat() / maxCount.toFloat()

    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(Spacing.sm)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = meal.mealName,
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.Medium
                ),
                color = TextPrimary
            )
            Text(
                text = "${meal.reservationCount} sipariş",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )
        }

        LinearProgressIndicator(
            progress = progress,
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp),
            color = PrimaryLight,
            trackColor = com.reservationapp.core.ui.theme.BorderDefault
        )
    }
}

