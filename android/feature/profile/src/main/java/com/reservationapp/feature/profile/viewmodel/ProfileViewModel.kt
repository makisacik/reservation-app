package com.reservationapp.feature.profile.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.UpdateUserProfileRequest
import com.reservationapp.domain.model.User
import com.reservationapp.domain.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.launch

class ProfileViewModel(
    private val authRepository: AuthRepository,
    private val authStateManager: AuthStateManager
) : ViewModel() {

    val currentUser: StateFlow<User?> = authStateManager.currentUser.map { it as? User }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = null
    )

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()

    // Editable fields
    val name = MutableStateFlow("")
    val email = MutableStateFlow("")
    val department = MutableStateFlow<String?>(null)

    init {
        loadUserProfile()
    }

    private fun loadUserProfile() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null

            when (val result = authRepository.getCurrentUser()) {
                is Result.Success -> {
                    val user = result.data
                    name.value = user.name
                    email.value = user.email
                    department.value = user.department
                    authStateManager.setCurrentUser(user)
                }
                is Result.Error -> {
                    _errorMessage.value = "Profil bilgileri yüklenemedi"
                }
                is Result.Loading -> {
                    // Handle loading
                }
            }

            _isLoading.value = false
        }
    }

    fun updateProfile() {
        if (name.value.isEmpty() || email.value.isEmpty()) {
            _errorMessage.value = "İsim ve email alanları zorunludur"
            return
        }

        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            _successMessage.value = null

            val request = UpdateUserProfileRequest(
                name = name.value,
                email = email.value,
                department = department.value
            )

            when (val result = authRepository.updateProfile(request)) {
                is Result.Success -> {
                    val updatedUser = result.data
                    authStateManager.setCurrentUser(updatedUser)
                    _successMessage.value = "Profil başarıyla güncellendi"
                }
                is Result.Error -> {
                    _errorMessage.value = "Profil güncellenirken bir hata oluştu"
                }
                is Result.Loading -> {
                    // Handle loading
                }
            }

            _isLoading.value = false
        }
    }

    fun refresh() {
        loadUserProfile()
    }

    fun resetForm() {
        loadUserProfile()
    }

    fun logout() {
        viewModelScope.launch {
            // Clear secure storage
            authRepository.logout()
            
            // Clear user data from form
            name.value = ""
            email.value = ""
            department.value = null
            
            // Clear auth state - this will trigger navigation to login
            authStateManager.clearUser()
        }
    }

    fun clearMessages() {
        _errorMessage.value = null
        _successMessage.value = null
    }
}

