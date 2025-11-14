package com.reservationapp.feature.home.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.AlertMessage
import com.reservationapp.domain.model.HomePageStats
import com.reservationapp.domain.model.Meal
import com.reservationapp.domain.model.Menu
import com.reservationapp.domain.model.MenuCategory
import com.reservationapp.domain.model.User
import com.reservationapp.domain.repository.AuthRepository
import com.reservationapp.domain.repository.HomeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.launch

class HomeViewModel(
    private val homeRepository: HomeRepository,
    private val authRepository: AuthRepository,
    private val authStateManager: AuthStateManager
) : ViewModel() {

    private val _stats = MutableStateFlow<HomePageStats?>(null)
    val stats: StateFlow<HomePageStats?> = _stats.asStateFlow()

    private val _categories = MutableStateFlow<List<MenuCategory>>(emptyList())
    val categories: StateFlow<List<MenuCategory>> = _categories.asStateFlow()

    private val _allMeals = MutableStateFlow<List<Meal>>(emptyList())
    val allMeals: StateFlow<List<Meal>> = _allMeals.asStateFlow()

    private val _todayMenus = MutableStateFlow<List<Menu>>(emptyList())
    val todayMenus: StateFlow<List<Menu>> = _todayMenus.asStateFlow()

    private val _selectedCategory = MutableStateFlow<String>("")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _displayedMeals = MutableStateFlow<List<Meal>>(emptyList())
    val displayedMeals: StateFlow<List<Meal>> = _displayedMeals.asStateFlow()

    private val _alertMessage = MutableStateFlow<AlertMessage?>(null)
    val alertMessage: StateFlow<AlertMessage?> = _alertMessage.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    val currentUser: StateFlow<User?> = authStateManager.currentUser.map { it as? User }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = null
    )

    init {
        loadData()
    }

    fun loadData() {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            val statsTask = homeRepository.getHomeStats()
            val userTask = authRepository.getCurrentUser()
            val categoriesTask = homeRepository.getCategories()
            val mealsTask = homeRepository.getMeals()
            val menusTask = homeRepository.getTodayMenu()

            when (statsTask) {
                is Result.Success -> _stats.value = statsTask.data
                is Result.Error -> _errorMessage.value = "İstatistikler yüklenemedi"
                is Result.Loading -> {}
            }

            when (userTask) {
                is Result.Success -> {
                    authStateManager.setCurrentUser(userTask.data)
                }
                is Result.Error -> {}
                is Result.Loading -> {}
            }

            when (categoriesTask) {
                is Result.Success -> {
                    _categories.value = categoriesTask.data
                    if (categoriesTask.data.isNotEmpty() && _selectedCategory.value.isEmpty()) {
                        val aylikMenu = categoriesTask.data.firstOrNull { it.name == "Aylık Menü" }
                        val defaultCategory = aylikMenu?.name ?: categoriesTask.data.firstOrNull()?.name ?: ""
                        _selectedCategory.value = defaultCategory
                    }
                }
                is Result.Error -> _errorMessage.value = "Kategoriler yüklenemedi"
                is Result.Loading -> {}
            }

            when (mealsTask) {
                is Result.Success -> {
                    _allMeals.value = mealsTask.data
                }
                is Result.Error -> _errorMessage.value = "Yemekler yüklenemedi"
                is Result.Loading -> {}
            }

            when (menusTask) {
                is Result.Success -> {
                    _todayMenus.value = menusTask.data
                }
                is Result.Error -> _errorMessage.value = "Menüler yüklenemedi"
                is Result.Loading -> {}
            }

            filterMeals()
            generateAlertMessage()

            _isLoading.value = false
        }
    }

    fun refresh() {
        loadData()
    }

    fun selectCategory(categoryName: String) {
        _selectedCategory.value = categoryName
        filterMeals()
    }

    private fun filterMeals() {
        val selectedCategoryName = _selectedCategory.value
        val allMealsList = _allMeals.value
        val todayMenusList = _todayMenus.value
        val categoriesList = _categories.value

        if (selectedCategoryName.isEmpty()) {
            val todayMenuMeals = todayMenusList.firstOrNull()?.meals ?: emptyList()
            _displayedMeals.value = if (todayMenuMeals.isEmpty()) {
                allMealsList.take(4)
            } else {
                todayMenuMeals
            }
        } else {
            val category = categoriesList.firstOrNull { it.name == selectedCategoryName }
            if (category == null) {
                val todayMenuMeals = todayMenusList.firstOrNull()?.meals ?: emptyList()
                _displayedMeals.value = if (todayMenuMeals.isEmpty()) {
                    allMealsList.take(4)
                } else {
                    todayMenuMeals
                }
                return
            }

            if (selectedCategoryName == "Aylık Menü") {
                val todayMenuMeals = todayMenusList.firstOrNull()?.meals ?: emptyList()
                _displayedMeals.value = if (todayMenuMeals.isEmpty()) {
                    allMealsList.take(4)
                } else {
                    todayMenuMeals
                }
            } else if (selectedCategoryName == "Japon Restoran") {
                _displayedMeals.value = allMealsList.filter { it.restaurantName == "Japon Restoran" }
            } else {
                _displayedMeals.value = allMealsList.filter { it.categoryId == category.id }
            }
        }
    }

    private fun generateAlertMessage() {
        val menuMeals = _todayMenus.value.firstOrNull()?.meals ?: emptyList()

        if (menuMeals.isEmpty()) {
            _alertMessage.value = AlertMessage(
                title = "Bugünün Özel Menüsü!",
                message = "Yemekhane 12:00–14:00 arası açık. Rezervasyon yapmayı unutmayın."
            )
            return
        }

        val hasKarniyarik = menuMeals.any {
            it.name.contains("Karnıyarık", ignoreCase = true) ||
            it.name.contains("Karniyarik", ignoreCase = true)
        }

        if (hasKarniyarik) {
            _alertMessage.value = AlertMessage(
                title = "Bugünün Özel Menüsü!",
                message = "Karnıyarık ile özel pilavımızı kaçırmayın. Yemekhane 12:00–14:00 arası açık."
            )
            return
        }

        menuMeals.firstOrNull()?.let { firstMeal ->
            _alertMessage.value = AlertMessage(
                title = "Bugünün Özel Menüsü!",
                message = "${firstMeal.name} kaçırmayın. Yemekhane 12:00–14:00 arası açık."
            )
        }
    }
}
