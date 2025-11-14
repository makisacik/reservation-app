package com.reservationapp.ui.admin

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.CreateMealRequest
import com.reservationapp.domain.model.Meal
import com.reservationapp.domain.model.MenuCategory
import com.reservationapp.domain.model.Restaurant
import com.reservationapp.domain.model.UpdateMealRequest
import com.reservationapp.domain.repository.AdminRepository
import com.reservationapp.domain.repository.HomeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AdminMenuViewModel(
    private val adminRepository: AdminRepository,
    private val homeRepository: HomeRepository
) : ViewModel() {

    private val _meals = MutableStateFlow<List<Meal>>(emptyList())
    val meals: StateFlow<List<Meal>> = _meals.asStateFlow()

    private val _filteredMeals = MutableStateFlow<List<Meal>>(emptyList())
    val filteredMeals: StateFlow<List<Meal>> = _filteredMeals.asStateFlow()

    private val _categories = MutableStateFlow<List<MenuCategory>>(emptyList())
    val categories: StateFlow<List<MenuCategory>> = _categories.asStateFlow()

    private val _restaurants = MutableStateFlow<List<Restaurant>>(emptyList())
    val restaurants: StateFlow<List<Restaurant>> = _restaurants.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()

    // Filters
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedRestaurantId = MutableStateFlow("")
    val selectedRestaurantId: StateFlow<String> = _selectedRestaurantId.asStateFlow()

    private val _selectedCategoryTab = MutableStateFlow(CategoryTab.ALL)
    val selectedCategoryTab: StateFlow<CategoryTab> = _selectedCategoryTab.asStateFlow()

    // Modal state
    private val _showMealForm = MutableStateFlow(false)
    val showMealForm: StateFlow<Boolean> = _showMealForm.asStateFlow()

    private val _editingMeal = MutableStateFlow<Meal?>(null)
    val editingMeal: StateFlow<Meal?> = _editingMeal.asStateFlow()

    private val _showDeleteConfirmation = MutableStateFlow(false)
    val showDeleteConfirmation: StateFlow<Boolean> = _showDeleteConfirmation.asStateFlow()

    private val _mealToDelete = MutableStateFlow<Meal?>(null)
    val mealToDelete: StateFlow<Meal?> = _mealToDelete.asStateFlow()

    init {
        loadData()
    }

    fun loadData() {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            val restaurantId = _selectedRestaurantId.value.takeIf { it.isNotEmpty() }
            
            val mealsTask = adminRepository.getAdminMeals(restaurantId, null)
            val categoriesTask = homeRepository.getCategories()
            val restaurantsTask = homeRepository.getRestaurants()

            when (mealsTask) {
                is Result.Success -> {
                    _meals.value = mealsTask.data
                    applyFilters()
                }
                is Result.Error -> {
                    _errorMessage.value = "Veriler yüklenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }

            when (categoriesTask) {
                is Result.Success -> {
                    _categories.value = categoriesTask.data
                }
                is Result.Error -> { /* Handle error silently */ }
                is Result.Loading -> { /* Handle loading */ }
            }

            when (restaurantsTask) {
                is Result.Success -> {
                    _restaurants.value = restaurantsTask.data
                }
                is Result.Error -> { /* Handle error silently */ }
                is Result.Loading -> { /* Handle loading */ }
            }

            _isLoading.value = false
        }
    }

    fun applyFilters() {
        var filtered = _meals.value

        // Search filter
        val query = _searchQuery.value.trim()
        if (query.isNotEmpty()) {
            val queryLower = query.lowercase()
            filtered = filtered.filter { it.name.lowercase().contains(queryLower) }
        }

        // Category tab filter
        when (_selectedCategoryTab.value) {
            CategoryTab.ALL -> { /* No filter */ }
            CategoryTab.YEMEKHANE -> {
                filtered = filtered.filter { it.restaurantName == "Yemekhane" }
            }
            CategoryTab.ALAKART -> {
                filtered = filtered.filter { it.categoryName == "Alakart" }
            }
            CategoryTab.JAPON -> {
                filtered = filtered.filter { it.restaurantName == "Japon Restoran" }
            }
        }

        _filteredMeals.value = filtered
    }

    fun createMeal(request: CreateMealRequest) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (adminRepository.createMeal(request)) {
                is Result.Success -> {
                    _successMessage.value = "Menü başarıyla oluşturuldu"
                    loadData()
                    _showMealForm.value = false
                    _editingMeal.value = null
                }
                is Result.Error -> {
                    _errorMessage.value = "Menü oluşturulurken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun updateMeal(id: String, request: UpdateMealRequest) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (adminRepository.updateMeal(id, request)) {
                is Result.Success -> {
                    _successMessage.value = "Menü başarıyla güncellendi"
                    loadData()
                    _showMealForm.value = false
                    _editingMeal.value = null
                }
                is Result.Error -> {
                    _errorMessage.value = "Menü güncellenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun deleteMeal(meal: Meal) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (adminRepository.deleteMeal(meal.id)) {
                is Result.Success -> {
                    _successMessage.value = "Menü başarıyla silindi"
                    loadData()
                    _showDeleteConfirmation.value = false
                    _mealToDelete.value = null
                }
                is Result.Error -> {
                    _errorMessage.value = "Menü silinirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
        applyFilters()
    }

    fun setSelectedRestaurantId(restaurantId: String) {
        _selectedRestaurantId.value = restaurantId
        loadData()
    }

    fun setSelectedCategoryTab(tab: CategoryTab) {
        _selectedCategoryTab.value = tab
        applyFilters()
    }

    fun openCreateForm() {
        _editingMeal.value = null
        _showMealForm.value = true
    }

    fun openEditForm(meal: Meal) {
        _editingMeal.value = meal
        _showMealForm.value = true
    }

    fun hideMealForm() {
        _showMealForm.value = false
        _editingMeal.value = null
    }

    fun confirmDelete(meal: Meal) {
        _mealToDelete.value = meal
        _showDeleteConfirmation.value = true
    }

    fun hideDeleteConfirmation() {
        _showDeleteConfirmation.value = false
        _mealToDelete.value = null
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }

    fun clearSuccessMessage() {
        _successMessage.value = null
    }
}

