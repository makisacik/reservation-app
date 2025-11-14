package com.reservationapp.feature.makereservation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.*
import com.reservationapp.domain.repository.HomeRepository
import com.reservationapp.domain.repository.ReservationRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class MakeReservationViewModel(
    private val reservationRepository: ReservationRepository,
    private val homeRepository: HomeRepository
) : ViewModel() {

    private val _currentStep = MutableStateFlow(1)
    val currentStep: StateFlow<Int> = _currentStep.asStateFlow()

    val selectedDates = MutableStateFlow<List<Date>>(emptyList())
    val selectedMealTimeSlot = MutableStateFlow<MealTimeSlot?>(null)

    val selectedRestaurant = MutableStateFlow<Restaurant?>(null)

    val selectedMenuType = MutableStateFlow<MenuType?>(null)

    val selectedMenu = MutableStateFlow<Menu?>(null)
    val selectedMeal = MutableStateFlow<Meal?>(null)
    val appetizer = MutableStateFlow(false)

    private val _mealTimeSlots = MutableStateFlow<List<MealTimeSlot>>(emptyList())
    val mealTimeSlots: StateFlow<List<MealTimeSlot>> = _mealTimeSlots.asStateFlow()

    private val _restaurants = MutableStateFlow<List<Restaurant>>(emptyList())
    val restaurants: StateFlow<List<Restaurant>> = _restaurants.asStateFlow()

    private val _availableMenus = MutableStateFlow<List<Menu>>(emptyList())
    val availableMenus: StateFlow<List<Menu>> = _availableMenus.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()

    init {
        loadInitialData()
    }

    fun loadInitialData() {
        _isLoading.value = true

        viewModelScope.launch {
            val mealTimeSlotsResult = homeRepository.getMealTimeSlots()
            val restaurantsResult = homeRepository.getRestaurants()

            when (mealTimeSlotsResult) {
                is Result.Success -> _mealTimeSlots.value = mealTimeSlotsResult.data
                is Result.Error -> _errorMessage.value = "Öğün saatleri yüklenemedi"
                is Result.Loading -> {}
            }

            when (restaurantsResult) {
                is Result.Success -> _restaurants.value = restaurantsResult.data
                is Result.Error -> _errorMessage.value = "Restoranlar yüklenemedi"
                is Result.Loading -> {}
            }

            _isLoading.value = false
        }
    }

    fun loadMenus() {
        val restaurant = selectedRestaurant.value
        val dates = selectedDates.value
        val menuType = selectedMenuType.value

        if (restaurant == null || dates.isEmpty()) {
            _availableMenus.value = emptyList()
            return
        }

        _isLoading.value = true

        viewModelScope.launch {
            val dateString = formatDateForMenus(dates.first())
            when (val result = homeRepository.getMenus(dateString, restaurant.id)) {
                is Result.Success -> {
                    val filteredMenus = if (menuType != null) {
                        val menuTypeString = when (menuType) {
                            MenuType.STANDARD -> "Standard"
                            MenuType.SPECIAL -> "Special"
                        }
                        result.data.filter { it.menuType == menuTypeString }
                    } else {
                        result.data
                    }
                    _availableMenus.value = filteredMenus
                }
                is Result.Error -> {
                    _errorMessage.value = "Menüler yüklenemedi"
                    _availableMenus.value = emptyList()
                }
                is Result.Loading -> {}
            }
            _isLoading.value = false
        }
    }
    
    private fun formatDateForMenus(date: Date): String {
        val format = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        return format.format(date)
    }

    fun nextStep() {
        if (canProceedToNextStep()) {
            _currentStep.value = (_currentStep.value + 1).coerceAtMost(5)

            if (_currentStep.value == 4) {
                loadMenus()
            }
        }
    }

    fun previousStep() {
        _currentStep.value = (_currentStep.value - 1).coerceAtLeast(1)
    }

    fun canProceedToNextStep(): Boolean {
        return when (_currentStep.value) {
            1 -> selectedDates.value.isNotEmpty() && selectedMealTimeSlot.value != null
            2 -> selectedRestaurant.value != null
            3 -> selectedMenuType.value != null
            4 -> selectedMenu.value != null
            5 -> true
            else -> false
        }
    }

    fun submitReservation() {
        val restaurant = selectedRestaurant.value
        val menu = selectedMenu.value
        val mealTimeSlot = selectedMealTimeSlot.value
        val dates = selectedDates.value

        if (restaurant == null || menu == null || mealTimeSlot == null || dates.isEmpty()) {
            _errorMessage.value = "Lütfen tüm alanları doldurun"
            return
        }

        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            val dateString = formatDateForApi(dates.first())
            val request = CreateReservationRequest(
                restaurantId = restaurant.id,
                menuId = menu.id,
                mealTimeSlotId = mealTimeSlot.id,
                date = dateString,
                appetizer = appetizer.value
            )

            when (reservationRepository.createReservation(request)) {
                is Result.Success -> {
                    _successMessage.value = "Rezervasyon başarıyla oluşturuldu"
                    resetForm()
                }
                is Result.Error -> {
                    _errorMessage.value = "Rezervasyon oluşturulurken bir hata oluştu."
                }
                is Result.Loading -> {}
            }

            _isLoading.value = false
        }
    }

    private fun resetForm() {
        selectedDates.value = emptyList()
        selectedMealTimeSlot.value = null
        selectedRestaurant.value = null
        selectedMenuType.value = null
        selectedMenu.value = null
        selectedMeal.value = null
        appetizer.value = false
        _currentStep.value = 1
    }

    private fun formatDateForApi(date: Date): String {
        val dateString = formatDateForMenus(date)
        return "${dateString}T00:00:00Z"
    }
}

