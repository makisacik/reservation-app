package com.reservationapp.ui.admin

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.DailySummary
import com.reservationapp.domain.model.DashboardSummary
import com.reservationapp.domain.model.PopularMeal
import com.reservationapp.domain.model.TodayReservationGroup
import com.reservationapp.domain.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AdminDashboardViewModel(
    private val adminRepository: AdminRepository
) : ViewModel() {

    private val _summary = MutableStateFlow<DashboardSummary?>(null)
    val summary: StateFlow<DashboardSummary?> = _summary.asStateFlow()

    private val _popularMeals = MutableStateFlow<List<PopularMeal>>(emptyList())
    val popularMeals: StateFlow<List<PopularMeal>> = _popularMeals.asStateFlow()

    private val _todayReservations = MutableStateFlow<List<TodayReservationGroup>>(emptyList())
    val todayReservations: StateFlow<List<TodayReservationGroup>> = _todayReservations.asStateFlow()

    private val _dailySummary = MutableStateFlow<List<DailySummary>>(emptyList())
    val dailySummary: StateFlow<List<DailySummary>> = _dailySummary.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    init {
        loadDashboardData()
    }

    fun loadDashboardData() {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            // Load all data in parallel
            val summaryTask = adminRepository.getDashboardSummary()
            val popularMealsTask = adminRepository.getPopularMeals(4)
            val todayReservationsTask = adminRepository.getTodayReservations()
            val dailySummaryTask = adminRepository.getDailySummary()

            when (summaryTask) {
                is Result.Success -> _summary.value = summaryTask.data
                is Result.Error -> _errorMessage.value = "Dashboard verileri yüklenirken bir hata oluştu."
                is Result.Loading -> { /* Handle loading */ }
            }

            when (popularMealsTask) {
                is Result.Success -> _popularMeals.value = popularMealsTask.data
                is Result.Error -> { /* Handle error silently, don't block other data */ }
                is Result.Loading -> { /* Handle loading */ }
            }

            when (todayReservationsTask) {
                is Result.Success -> _todayReservations.value = todayReservationsTask.data
                is Result.Error -> { /* Handle error silently, don't block other data */ }
                is Result.Loading -> { /* Handle loading */ }
            }

            when (dailySummaryTask) {
                is Result.Success -> _dailySummary.value = dailySummaryTask.data
                is Result.Error -> { /* Handle error silently, don't block other data */ }
                is Result.Loading -> { /* Handle loading */ }
            }

            _isLoading.value = false
        }
    }

    fun refresh() {
        loadDashboardData()
    }
}

