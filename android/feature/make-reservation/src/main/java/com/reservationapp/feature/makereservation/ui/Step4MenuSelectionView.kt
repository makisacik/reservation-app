package com.reservationapp.feature.makereservation.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.Meal
import com.reservationapp.domain.model.Menu
import com.reservationapp.domain.model.MenuType

@Composable
fun Step4MenuSelectionView(
    menus: List<Menu>,
    selectedMeal: Meal?,
    onMealSelected: (Meal, Menu) -> Unit,
    appetizer: Boolean,
    onAppetizerChanged: (Boolean) -> Unit,
    selectedRestaurant: com.reservationapp.domain.model.Restaurant?,
    selectedMenuType: MenuType?,
    isLoading: Boolean,
    errorMessage: String?
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(Spacing.lg)
    ) {
        // Header
        Column(
            verticalArrangement = Arrangement.spacedBy(Spacing.xs)
        ) {
            Text(
                text = "Menü Seçimi",
                style = Typography.titleLarge,
                fontWeight = FontWeight.SemiBold
            )
            
            if (selectedRestaurant != null && selectedMenuType != null) {
                Text(
                    text = "${selectedRestaurant.name} - ${getMenuTypeDisplayName(selectedMenuType)}",
                    style = Typography.bodyMedium,
                    color = TextSecondary
                )
            }
        }
        
        // Loading State
        if (isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.xl),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = PrimaryMain)
            }
        }
        // Error State
        else if (errorMessage != null) {
            ErrorView(message = errorMessage)
        }
        // Empty State
        else if (menus.isEmpty()) {
            EmptyMenusView()
        }
        // Meals List
        else {
            val meals = menus.firstOrNull()?.meals ?: emptyList()
            
            Column(
                verticalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                meals.forEach { meal ->
                    MealSelectionCard(
                        meal = meal,
                        isSelected = selectedMeal?.id == meal.id,
                        onSelect = {
                            menus.firstOrNull()?.let { menu ->
                                onMealSelected(meal, menu)
                            }
                        }
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(Spacing.md))
            
            // Appetizer Checkbox
            AppetizerCheckbox(
                isChecked = appetizer,
                onCheckedChange = onAppetizerChanged
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MealSelectionCard(
    meal: Meal,
    isSelected: Boolean,
    onSelect: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onSelect,
        colors = CardDefaults.cardColors(
            containerColor = BackgroundPaper
        ),
        border = if (isSelected) {
            androidx.compose.foundation.BorderStroke(3.dp, PrimaryMain)
        } else null,
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (isSelected) 8.dp else 4.dp
        )
    ) {
        Column {
            // Image
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
            ) {
                if (!meal.imageUrl.isNullOrEmpty()) {
                    AsyncImage(
                        model = meal.imageUrl,
                        contentDescription = meal.name,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp)),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
                            .background(Color.Gray.copy(alpha = 0.3f))
                    )
                }
            }
            
            // Info
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.md),
                verticalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                Text(
                    text = meal.name,
                    style = Typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary,
                    maxLines = 2
                )
                
                Text(
                    text = meal.description ?: "Açıklama yok",
                    style = Typography.bodySmall,
                    color = TextSecondary,
                    maxLines = 3
                )
                
                if (isSelected) {
                    Button(
                        onClick = { },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = false,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = PrimaryMain,
                            contentColor = Color.White
                        )
                    ) {
                        Text(
                            text = "Seçildi",
                            style = Typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AppetizerCheckbox(
    isChecked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = WarningMain.copy(alpha = 0.1f),
        shape = RoundedCornerShape(8.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.md),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            Checkbox(
                checked = isChecked,
                onCheckedChange = onCheckedChange,
                colors = CheckboxDefaults.colors(
                    checkedColor = PrimaryMain
                )
            )
            
            Text(
                text = "Aparetif talebi ekle (Mevsim meze tabağı)",
                style = Typography.bodyMedium,
                color = TextPrimary
            )
        }
    }
}

@Composable
fun ErrorView(message: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(Spacing.xl),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(Spacing.sm)
    ) {
        Icon(
            imageVector = androidx.compose.material.icons.Icons.Default.Warning,
            contentDescription = null,
            modifier = Modifier.size(48.dp),
            tint = ErrorMain
        )
        Text(
            text = message,
            style = Typography.bodyLarge,
            color = TextSecondary,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@Composable
fun EmptyMenusView() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(Spacing.xl),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(Spacing.sm)
    ) {
        Icon(
            imageVector = androidx.compose.material.icons.Icons.Default.Restaurant,
            contentDescription = null,
            modifier = Modifier.size(48.dp),
            tint = TextTertiary
        )
        Text(
            text = "Bu tarih ve menü tipi için menü bulunamadı.",
            style = Typography.bodyLarge,
            color = TextSecondary,
            modifier = Modifier.fillMaxWidth()
        )
        Text(
            text = "Lütfen farklı bir menü tipi seçin veya başka bir tarih deneyin.",
            style = Typography.bodySmall,
            color = TextTertiary,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

private fun getMenuTypeDisplayName(menuType: MenuType): String {
    return when (menuType) {
        MenuType.STANDARD -> "Standart Menü"
        MenuType.SPECIAL -> "Özel Menü"
    }
}
