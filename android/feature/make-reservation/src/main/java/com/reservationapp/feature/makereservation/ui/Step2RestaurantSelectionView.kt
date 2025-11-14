package com.reservationapp.feature.makereservation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.Restaurant

@Composable
fun Step2RestaurantSelectionView(
    restaurants: List<Restaurant>,
    selectedRestaurant: Restaurant?,
    onRestaurantSelected: (Restaurant) -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(Spacing.md)
    ) {
        Text(
            text = "Restoran Seçimi",
            style = Typography.titleLarge
        )

        Text(
            text = "Lütfen bir restoran seçin",
            style = Typography.bodyMedium,
            color = TextSecondary
        )

        restaurants.forEach { restaurant ->
            RestaurantCard(
                restaurant = restaurant,
                isSelected = selectedRestaurant?.id == restaurant.id,
                onClick = { onRestaurantSelected(restaurant) }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RestaurantCard(
    restaurant: Restaurant,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick,
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) PrimaryLight else BackgroundPaper
        ),
        border = if (isSelected) {
            androidx.compose.foundation.BorderStroke(2.dp, PrimaryMain)
        } else null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.md)
        ) {
            Text(
                text = restaurant.name,
                style = Typography.titleMedium,
                color = if (isSelected) PrimaryMain else TextPrimary
            )
            restaurant.description?.let { description ->
                Spacer(modifier = Modifier.height(Spacing.xs))
                Text(
                    text = description,
                    style = Typography.bodySmall,
                    color = TextSecondary
                )
            }
        }
    }
}

