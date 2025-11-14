package com.reservationapp.feature.auth.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.AuthStateManager
import com.reservationapp.core.common.Result
import com.reservationapp.core.common.extensions.isValidEmail
import com.reservationapp.domain.model.User
import com.reservationapp.domain.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

enum class LoginRole {
    PERSONEL,
    ADMIN
}

class LoginViewModel(
    private val authRepository: AuthRepository,
    private val authStateManager: AuthStateManager
) : ViewModel() {

    val email = MutableStateFlow("")
    val password = MutableStateFlow("")
    val selectedRole = MutableStateFlow(LoginRole.PERSONEL)

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _isAuthenticated = MutableStateFlow(false)
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated.asStateFlow()

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    fun login() {
        // Clear previous error
        _errorMessage.value = null

        // Basic validation
        if (email.value.isEmpty() || password.value.isEmpty()) {
            _errorMessage.value = "Lütfen email ve şifre girin"
            return
        }

        // Email format validation
        if (!email.value.isValidEmail()) {
            _errorMessage.value = "Geçerli bir email adresi girin"
            return
        }

        _isLoading.value = true

        viewModelScope.launch {
            when (val result = authRepository.login(email.value, password.value)) {
                is Result.Success -> {
                    val authResponse = result.data

                    // Verify token was saved
                    if (authResponse.authToken.isEmpty()) {
                        _errorMessage.value = "Giriş başarısız. Token alınamadı."
                        _isLoading.value = false
                        return@launch
                    }

                    // Fetch current user
                    when (val userResult = authRepository.getCurrentUser()) {
                        is Result.Success -> {
                            val user = userResult.data

                            // Validate role matches selected role (case-sensitive to match iOS)
                            val isUserAdmin = user.role == "Admin"
                            val selectedIsAdmin = selectedRole.value == LoginRole.ADMIN

                            if (isUserAdmin && !selectedIsAdmin) {
                                authRepository.logout()
                                _errorMessage.value = "Bu hesap Admin hesabıdır. Admin bölümünden giriş yapmalısınız."
                                _isLoading.value = false
                                return@launch
                            } else if (!isUserAdmin && selectedIsAdmin) {
                                authRepository.logout()
                                _errorMessage.value = "Bu hesap Personel hesabıdır. Personel bölümünden giriş yapmalısınız."
                                _isLoading.value = false
                                return@launch
                            }

                            // Success - set user and notify
                            _currentUser.value = user
                            _isAuthenticated.value = true
                            authStateManager.setCurrentUser(user)
                            authStateManager.setAuthenticated(true)
                        }
                        is Result.Error -> {
                            _errorMessage.value = "Kullanıcı bilgileri alınamadı."
                        }
                        is Result.Loading -> {
                            // Handle loading
                        }
                    }
                }
                is Result.Error -> {
                    _errorMessage.value = when (result.exception) {
                        is com.reservationapp.core.network.NetworkError.Unauthorized -> {
                            "Giriş başarısız. Email ve şifrenizi kontrol edin."
                        }
                        else -> {
                            "Bir hata oluştu. Lütfen tekrar deneyin."
                        }
                    }
                }
                is Result.Loading -> {
                    // Handle loading
                }
            }

            _isLoading.value = false
        }
    }
}

