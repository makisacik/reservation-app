package com.reservationapp.ui.admin

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.SettingsUpdateRequest
import com.reservationapp.domain.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

enum class SettingsTab(val displayName: String) {
    GENERAL("Genel"),
    RESERVATION("Rezervasyon"),
    NOTIFICATIONS("Bildirimler")
}

class AdminSettingsViewModel(
    private val adminRepository: AdminRepository
) : ViewModel() {

    private val _generalSettings = MutableStateFlow<Map<String, String>>(emptyMap())
    val generalSettings: StateFlow<Map<String, String>> = _generalSettings.asStateFlow()

    private val _reservationSettings = MutableStateFlow<Map<String, String>>(emptyMap())
    val reservationSettings: StateFlow<Map<String, String>> = _reservationSettings.asStateFlow()

    private val _notificationSettings = MutableStateFlow<Map<String, String>>(emptyMap())
    val notificationSettings: StateFlow<Map<String, String>> = _notificationSettings.asStateFlow()

    private val _selectedTab = MutableStateFlow(SettingsTab.GENERAL)
    val selectedTab: StateFlow<SettingsTab> = _selectedTab.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()

    init {
        loadSettings()
    }

    fun loadSettings() {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            val generalResult = adminRepository.getGeneralSettings()
            val reservationResult = adminRepository.getReservationSettings()
            val notificationResult = adminRepository.getNotificationSettings()

            when (generalResult) {
                is Result.Success -> {
                    _generalSettings.value = generalResult.data
                }
                is Result.Error -> {
                    _errorMessage.value = "Genel ayarlar yüklenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }

            when (reservationResult) {
                is Result.Success -> {
                    _reservationSettings.value = reservationResult.data
                }
                is Result.Error -> {
                    _errorMessage.value = "Rezervasyon ayarları yüklenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }

            when (notificationResult) {
                is Result.Success -> {
                    _notificationSettings.value = notificationResult.data
                }
                is Result.Error -> {
                    _errorMessage.value = "Bildirim ayarları yüklenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }

            _isLoading.value = false
        }
    }

    fun setSelectedTab(tab: SettingsTab) {
        _selectedTab.value = tab
    }

    fun updateGeneralSettings(settings: Map<String, String>) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (val result = adminRepository.updateGeneralSettings(SettingsUpdateRequest(settings))) {
                is Result.Success -> {
                    _generalSettings.value = result.data
                    _successMessage.value = "Genel ayarlar başarıyla güncellendi"
                }
                is Result.Error -> {
                    _errorMessage.value = "Genel ayarlar güncellenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun updateReservationSettings(settings: Map<String, String>) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (val result = adminRepository.updateReservationSettings(SettingsUpdateRequest(settings))) {
                is Result.Success -> {
                    _reservationSettings.value = result.data
                    _successMessage.value = "Rezervasyon ayarları başarıyla güncellendi"
                }
                is Result.Error -> {
                    _errorMessage.value = "Rezervasyon ayarları güncellenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun updateNotificationSettings(settings: Map<String, String>) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (val result = adminRepository.updateNotificationSettings(SettingsUpdateRequest(settings))) {
                is Result.Success -> {
                    _notificationSettings.value = result.data
                    _successMessage.value = "Bildirim ayarları başarıyla güncellendi"
                }
                is Result.Error -> {
                    _errorMessage.value = "Bildirim ayarları güncellenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }

    fun clearSuccessMessage() {
        _successMessage.value = null
    }
}

