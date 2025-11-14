package com.reservationapp.feature.makereservation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.repository.HomeRepository
import com.reservationapp.domain.repository.ReservationRepository
import com.reservationapp.feature.makereservation.viewmodel.MakeReservationViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MakeReservationScreen(
    reservationRepository: ReservationRepository,
    homeRepository: HomeRepository,
    onNavigateBack: () -> Unit,
    onReservationCreated: () -> Unit,
    viewModel: MakeReservationViewModel = remember {
        MakeReservationViewModel(
            reservationRepository = reservationRepository,
            homeRepository = homeRepository
        )
    }
) {
    val currentStep by viewModel.currentStep.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val successMessage by viewModel.successMessage.collectAsState()
    val selectedMenuType by viewModel.selectedMenuType.collectAsState()

    LaunchedEffect(successMessage) {
        if (successMessage != null) {
            onReservationCreated()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Yeni Rezervasyon") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Geri"
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(Spacing.lg)
        ) {
            // Stepper
            ReservationStepper(currentStep = currentStep)

            Spacer(modifier = Modifier.height(Spacing.xl))

            // Error message
            errorMessage?.let { error ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = ErrorMain.copy(alpha = 0.1f))
                ) {
                    Text(
                        text = error,
                        modifier = Modifier.padding(Spacing.md),
                        style = Typography.bodyMedium,
                        color = ErrorMain
                    )
                }
                Spacer(modifier = Modifier.height(Spacing.md))
            }

            // Step Content
            when (currentStep) {
                1 -> Step1DateSelectionView(
                    selectedDates = viewModel.selectedDates.collectAsState().value,
                    onDatesSelected = { viewModel.selectedDates.value = it },
                    mealTimeSlots = viewModel.mealTimeSlots.collectAsState().value,
                    selectedMealTimeSlot = viewModel.selectedMealTimeSlot.collectAsState().value,
                    onMealTimeSlotSelected = { viewModel.selectedMealTimeSlot.value = it }
                )
                2 -> Step2RestaurantSelectionView(
                    restaurants = viewModel.restaurants.collectAsState().value,
                    selectedRestaurant = viewModel.selectedRestaurant.collectAsState().value,
                    onRestaurantSelected = { viewModel.selectedRestaurant.value = it }
                )
                3 -> Step3MenuTypeSelectionView(
                    selectedMenuType = viewModel.selectedMenuType.collectAsState().value,
                    onMenuTypeSelected = { menuType ->
                        viewModel.selectedMenuType.value = menuType
                        // Reload menus if restaurant and date are already selected
                        if (viewModel.selectedRestaurant.value != null && viewModel.selectedDates.value.isNotEmpty()) {
                            viewModel.loadMenus()
                        }
                    }
                )
                4 -> Step4MenuSelectionView(
                    menus = viewModel.availableMenus.collectAsState().value,
                    selectedMeal = viewModel.selectedMeal.collectAsState().value,
                    onMealSelected = { meal, menu ->
                        viewModel.selectedMeal.value = meal
                        viewModel.selectedMenu.value = menu
                    },
                    appetizer = viewModel.appetizer.collectAsState().value,
                    onAppetizerChanged = { viewModel.appetizer.value = it },
                    selectedRestaurant = viewModel.selectedRestaurant.collectAsState().value,
                    selectedMenuType = selectedMenuType,
                    isLoading = isLoading,
                    errorMessage = errorMessage
                )
                5 -> Step5ConfirmationView(
                    viewModel = viewModel,
                    onSubmit = { viewModel.submitReservation() }
                )
            }

            Spacer(modifier = Modifier.height(Spacing.lg))

            // Navigation Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                if (currentStep > 1) {
                    Button(
                        onClick = { viewModel.previousStep() },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = BackgroundPaper,
                            contentColor = TextPrimary
                        )
                    ) {
                        Text("Geri")
                    }
                }

                if (currentStep < 5) {
                    Button(
                        onClick = { viewModel.nextStep() },
                        modifier = Modifier.weight(1f),
                        enabled = viewModel.canProceedToNextStep() && !isLoading,
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryMain)
                    ) {
                        Text("İleri")
                    }
                }
            }
        }
    }
}

@Composable
fun ReservationStepper(currentStep: Int) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        (1..5).forEach { step ->
            StepIndicator(
                step = step,
                isActive = step == currentStep,
                isCompleted = step < currentStep
            )
        }
    }
}

@Composable
fun StepIndicator(step: Int, isActive: Boolean, isCompleted: Boolean) {
    Box(
        modifier = Modifier.size(40.dp),
        contentAlignment = Alignment.Center
    ) {
        if (isCompleted) {
            // Completed step - show checkmark
            Surface(
                modifier = Modifier.fillMaxSize(),
                shape = androidx.compose.foundation.shape.CircleShape,
                color = PrimaryMain
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "✓",
                        color = Color.White,
                        style = Typography.bodySmall
                    )
                }
            }
        } else if (isActive) {
            // Active step - show number with primary color
            Surface(
                modifier = Modifier.fillMaxSize(),
                shape = androidx.compose.foundation.shape.CircleShape,
                color = PrimaryMain
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = step.toString(),
                        color = Color.White,
                        style = Typography.bodyMedium,
                        fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
                    )
                }
            }
        } else {
            // Inactive step - show number with gray
            Surface(
                modifier = Modifier.fillMaxSize(),
                shape = androidx.compose.foundation.shape.CircleShape,
                color = BackgroundInactiveTab
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = step.toString(),
                        color = TextSecondary,
                        style = Typography.bodyMedium
                    )
                }
            }
        }
    }
}

