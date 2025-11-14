package com.reservationapp.feature.home.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.compose.AsyncImagePainter
import coil.compose.SubcomposeAsyncImage
import coil.compose.SubcomposeAsyncImageContent
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.model.*
import com.reservationapp.domain.repository.AuthRepository
import com.reservationapp.domain.repository.HomeRepository
import com.reservationapp.feature.home.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    homeRepository: HomeRepository,
    authRepository: AuthRepository,
    authStateManager: AuthStateManager,
    viewModel: HomeViewModel = remember {
        HomeViewModel(
            homeRepository = homeRepository,
            authRepository = authRepository,
            authStateManager = authStateManager
        )
    },
    onNavigateToReservation: () -> Unit = {}
) {
    val stats by viewModel.stats.collectAsState()
    val categories by viewModel.categories.collectAsState()
    val displayedMeals by viewModel.displayedMeals.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val currentUser by viewModel.currentUser.collectAsState()
    val alertMessage by viewModel.alertMessage.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPage)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(Spacing.md)
        ) {
            PersonalHeaderView(user = currentUser)

            Spacer(modifier = Modifier.height(Spacing.lg))

            NotificationCardView(alertMessage = alertMessage)

            Spacer(modifier = Modifier.height(Spacing.lg))

            StatsGridView(stats = stats)

            Spacer(modifier = Modifier.height(Spacing.lg))

            MenuSectionView(
                categories = categories,
                selectedCategory = selectedCategory,
                meals = displayedMeals,
                isLoading = isLoading,
                onCategorySelected = { categoryName ->
                    viewModel.selectCategory(categoryName)
                },
                onReservationTap = onNavigateToReservation
            )
        }

        if (isLoading && stats == null) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = PrimaryMain
            )
        }

        errorMessage?.let { error ->
            LaunchedEffect(error) {
            }
        }
    }
}

@Composable
fun PersonalHeaderView(user: User?) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.linearGradient(
                        colors = listOf(PrimaryLight, PrimaryMain)
                    )
                )
                .padding(Spacing.lg)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(60.dp)
                        .background(
                            brush = Brush.linearGradient(
                                colors = listOf(PrimaryLight, PrimaryMain)
                            ),
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = getInitials(user?.name),
                        style = Typography.headlineSmall,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.width(Spacing.md))

                Column {
                    Text(
                        text = user?.name ?: "Kullanıcı",
                        style = Typography.headlineSmall,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                    user?.department?.let { department ->
                        Text(
                            text = department,
                            style = Typography.bodyMedium,
                            color = Color.White.copy(alpha = 0.9f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun NotificationCardView(alertMessage: AlertMessage?) {
    alertMessage?.let { alert ->
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = WarningMain)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.md),
                verticalAlignment = Alignment.Top
            ) {
                Icon(
                    imageVector = Icons.Default.Warning,
                    contentDescription = null,
                    tint = TextPrimary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(Spacing.sm))
                Column {
                    Text(
                        text = alert.title,
                        style = Typography.bodyMedium,
                        color = TextPrimary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = alert.message,
                        style = Typography.bodySmall,
                        color = TextPrimary.copy(alpha = 0.9f)
                    )
                }
            }
        }
    }
}

@Composable
fun StatsGridView(stats: HomePageStats?) {
    Column(
        verticalArrangement = Arrangement.spacedBy(Spacing.md)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            StatCardView(
                modifier = Modifier.weight(1f),
                title = "Toplam Yemek",
                value = formatValue(stats?.totalMeals ?: 0),
                icon = "chart.line.uptrend.xyaxis",
                color = SuccessMain
            )
            StatCardView(
                modifier = Modifier.weight(1f),
                title = "En Popüler",
                value = stats?.mostPopular ?: "N/A",
                icon = "person.3.fill",
                color = PrimaryLight
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            StatCardView(
                modifier = Modifier.weight(1f),
                title = "Tercih Oranı",
                value = formatPercentage(stats?.preferenceRate ?: 0),
                icon = "heart.fill",
                color = ErrorMain
            )
            StatCardView(
                modifier = Modifier.weight(1f),
                title = "Aperatif",
                value = formatValue(stats?.aperatifCount ?: 0),
                icon = "calendar",
                color = WarningMain
            )
        }
    }
}

@Composable
fun StatCardView(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    icon: String,
    color: Color
) {
    Card(
        modifier = modifier.height(120.dp),
        colors = CardDefaults.cardColors(containerColor = BackgroundPaper)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(Spacing.md),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = title,
                style = Typography.bodySmall,
                color = TextSecondary
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = value,
                    style = Typography.headlineMedium,
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1
                )
                Spacer(modifier = Modifier.width(24.dp))
            }
        }
    }
}

@Composable
fun MenuSectionView(
    categories: List<MenuCategory>,
    selectedCategory: String,
    meals: List<Meal>,
    isLoading: Boolean,
    onCategorySelected: (String) -> Unit,
    onReservationTap: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = BackgroundPaper)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.lg),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(Spacing.xs)
            ) {
                Text(
                    text = "Bugünün Menüsü",
                    style = Typography.headlineSmall,
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Restoran rezervasyonu ve yemekhane menüsü",
                    style = Typography.bodySmall,
                    color = TextSecondary
                )
            }

            CategoryTabsView(
                categories = categories,
                selectedCategory = selectedCategory,
                onCategorySelected = onCategorySelected
            )

            MealGridView(
                meals = meals,
                isLoading = isLoading,
                maxItems = 4
            )

            Button(
                onClick = onReservationTap,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryMain)
            ) {
                Text(
                    text = "Rezervasyon Yap",
                    style = Typography.labelLarge,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

@Composable
fun CategoryTabsView(
    categories: List<MenuCategory>,
    selectedCategory: String,
    onCategorySelected: (String) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(Spacing.md)
    ) {
        Spacer(modifier = Modifier.width(Spacing.md))
        categories.forEach { category ->
            CategoryTabButton(
                title = category.name,
                isSelected = selectedCategory == category.name,
                onClick = { onCategorySelected(category.name) }
            )
        }
        Spacer(modifier = Modifier.width(Spacing.md))
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CategoryTabButton(
    title: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    FilterChip(
        selected = isSelected,
        onClick = onClick,
        label = {
            Text(
                text = title,
                style = Typography.bodyMedium,
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
            )
        },
        colors = FilterChipDefaults.filterChipColors(
            selectedContainerColor = PrimaryMain,
            containerColor = BackgroundInactiveTab,
            selectedLabelColor = Color.White,
            labelColor = TextSecondary
        )
    )
}

@Composable
fun MealGridView(
    meals: List<Meal>,
    isLoading: Boolean,
    maxItems: Int? = null
) {
    if (isLoading) {
        CircularProgressIndicator(
            modifier = Modifier
                .fillMaxWidth()
                .padding(Spacing.xl),
            color = PrimaryMain
        )
    } else if (meals.isEmpty()) {
        EmptyMealsView()
    } else {
        val displayMeals = maxItems?.let { meals.take(it) } ?: meals
        Column(
            verticalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            displayMeals.forEach { meal ->
                MealCardView(meal = meal)
            }
        }
    }
}

@Composable
fun MealCardView(meal: Meal) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = BackgroundPaper)
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp),
                contentAlignment = Alignment.TopEnd
            ) {
                val placeholderGradient = Brush.linearGradient(
                    colors = listOf(
                        PrimaryLight.copy(alpha = 0.3f),
                        PrimaryMain.copy(alpha = 0.3f)
                    )
                )
                
                if (!meal.imageUrl.isNullOrEmpty()) {
                    SubcomposeAsyncImage(
                        model = meal.imageUrl,
                        contentDescription = meal.name,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(150.dp)
                            .clip(
                                RoundedCornerShape(
                                    topStart = 12.dp,
                                    topEnd = 12.dp
                                )
                            ),
                        contentScale = ContentScale.Crop
                    ) {
                        when (painter.state) {
                            is AsyncImagePainter.State.Loading -> {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(150.dp)
                                        .background(placeholderGradient)
                                )
                            }
                            is AsyncImagePainter.State.Error -> {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(150.dp)
                                        .background(placeholderGradient)
                                )
                            }
                            else -> {
                                SubcomposeAsyncImageContent()
                            }
                        }
                    }
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(150.dp)
                            .background(placeholderGradient)
                    )
                }
                
                meal.categoryName?.let { categoryName ->
                    Box(
                        modifier = Modifier.padding(Spacing.sm)
                    ) {
                        CategoryBadge(name = categoryName)
                    }
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.md),
                verticalArrangement = Arrangement.spacedBy(Spacing.xs)
            ) {
                Text(
                    text = meal.name,
                    style = Typography.headlineSmall,
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2
                )
                meal.kcal?.let { kcal ->
                    Text(
                        text = "$kcal kcal",
                        style = Typography.bodySmall,
                        color = TextSecondary
                    )
                }
            }
        }
    }
}

@Composable
fun CategoryBadge(name: String) {
    Surface(
        color = PrimaryLight,
        shape = MaterialTheme.shapes.small
    ) {
        Text(
            text = name,
            style = Typography.bodySmall,
            color = Color.White,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(horizontal = Spacing.sm, vertical = Spacing.xs)
        )
    }
}

@Composable
fun EmptyMealsView() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(Spacing.xl),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(Spacing.sm)
    ) {
        Icon(
            imageVector = Icons.Default.Restaurant,
            contentDescription = null,
            modifier = Modifier.size(48.dp),
            tint = TextTertiary
        )
        Text(
            text = "Henüz yemek bulunmamaktadır.",
            style = Typography.bodyMedium,
            color = TextSecondary
        )
    }
}

private fun getInitials(name: String?): String {
    if (name.isNullOrEmpty()) return "?"
    val words = name.trim().split("\\s+".toRegex())
    if (words.isEmpty()) return "?"
    var initials = words[0].take(1).uppercase()
    if (words.size > 1) {
        initials += words[1].take(1).uppercase()
    }
    return initials
}

private fun formatValue(value: Int): String {
    return java.text.NumberFormat.getNumberInstance(java.util.Locale("tr", "TR")).format(value)
}

private fun formatPercentage(value: Int): String {
    return "$value%"
}
