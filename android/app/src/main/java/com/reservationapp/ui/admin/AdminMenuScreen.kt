package com.reservationapp.ui.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.repository.AdminRepository
import com.reservationapp.domain.repository.HomeRepository
import com.reservationapp.ui.admin.menu.*
import kotlinx.coroutines.delay

@Composable
fun AdminMenuScreen(
    adminRepository: AdminRepository,
    homeRepository: HomeRepository,
    viewModel: AdminMenuViewModel = remember {
        AdminMenuViewModel(adminRepository, homeRepository)
    }
) {
    val filteredMeals by viewModel.filteredMeals.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val successMessage by viewModel.successMessage.collectAsState()
    val selectedCategoryTab by viewModel.selectedCategoryTab.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedRestaurantId by viewModel.selectedRestaurantId.collectAsState()
    val showMealForm by viewModel.showMealForm.collectAsState()
    val showDeleteConfirmation by viewModel.showDeleteConfirmation.collectAsState()
    val mealToDelete by viewModel.mealToDelete.collectAsState()

    val hasFilters = searchQuery.isNotEmpty() ||
            selectedCategoryTab != CategoryTab.ALL ||
            selectedRestaurantId.isNotEmpty()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPage)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(Spacing.md),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            // Header
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(Spacing.xs)
            ) {
                Text(
                    text = "Menü Yönetimi",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )
                Text(
                    text = "Yemek menülerini düzenleyin ve yönetin",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }

            // Filters
            MealFiltersView(viewModel = viewModel)

            // Category Tabs
            MenuCategoryTabsView(
                selectedTab = selectedCategoryTab,
                onTabSelected = { viewModel.setSelectedCategoryTab(it) }
            )

            // Meals Grid
            if (isLoading && filteredMeals.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(Spacing.xl),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = PrimaryMain)
                }
            } else if (filteredMeals.isEmpty()) {
                EmptyMealsView(hasFilters = hasFilters)
            } else {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(Spacing.md)
                ) {
                    filteredMeals.forEach { meal ->
                        AdminMealCardView(
                            meal = meal,
                            onEdit = {
                                viewModel.openEditForm(meal)
                            },
                            onDelete = {
                                viewModel.confirmDelete(meal)
                            }
                        )
                    }
                }
            }
        }

        // Loading overlay
        if (isLoading && filteredMeals.isNotEmpty()) {
            CircularProgressIndicator(
                modifier = Modifier.align(Alignment.Center),
                color = PrimaryMain
            )
        }

        // Error message
        errorMessage?.let { error ->
            Snackbar(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(Spacing.md),
                action = {
                    TextButton(onClick = { viewModel.clearErrorMessage() }) {
                        Text("Tamam")
                    }
                }
            ) {
                Text(error)
            }
        }

        // Success message
        successMessage?.let { success ->
            LaunchedEffect(success) {
                delay(3000)
                viewModel.clearSuccessMessage()
            }
            Snackbar(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(Spacing.md),
                action = {
                    TextButton(onClick = { viewModel.clearSuccessMessage() }) {
                        Text("Tamam")
                    }
                }
            ) {
                Text(success)
            }
        }

        // Meal Form Modal
        MealFormView(
            isPresented = showMealForm,
            viewModel = viewModel,
            onDismiss = { viewModel.hideMealForm() }
        )

        // Delete Confirmation Dialog
        if (showDeleteConfirmation && mealToDelete != null) {
            AlertDialog(
                onDismissRequest = { 
                    if (!isLoading) {
                        viewModel.hideDeleteConfirmation()
                    }
                },
                title = {
                    Text("Menü Sil")
                },
                text = {
                    Text("\"${mealToDelete!!.name}\" menüsünü silmek istediğinize emin misiniz?")
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            if (!isLoading) {
                                viewModel.deleteMeal(mealToDelete!!)
                            }
                        },
                        enabled = !isLoading,
                        colors = ButtonDefaults.textButtonColors(
                            contentColor = ErrorMain
                        )
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = ErrorMain
                            )
                        } else {
                            Text("Sil")
                        }
                    }
                },
                dismissButton = {
                    TextButton(
                        onClick = { viewModel.hideDeleteConfirmation() },
                        enabled = !isLoading
                    ) {
                        Text("İptal")
                    }
                }
            )
        }
    }
}

