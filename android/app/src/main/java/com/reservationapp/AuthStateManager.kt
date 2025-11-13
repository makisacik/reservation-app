package com.reservationapp

import com.reservationapp.core.common.AuthStateManager as AuthStateManagerInterface
import com.reservationapp.core.common.Result
import com.reservationapp.core.storage.SecureStorage
import com.reservationapp.domain.model.User
import com.reservationapp.domain.repository.AuthRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AuthStateManager(
    private val secureStorage: SecureStorage,
    private val authRepository: AuthRepository
) : AuthStateManagerInterface {

    private val _isAuthenticated = MutableStateFlow(false)
    override val isAuthenticated: StateFlow<Boolean> = _isAuthenticated.asStateFlow()

    private val _hasCheckedAuth = MutableStateFlow(false)
    override val hasCheckedAuth: StateFlow<Boolean> = _hasCheckedAuth.asStateFlow()

    private val _currentUser = MutableStateFlow<User?>(null)
    override val currentUser: StateFlow<Any?> = _currentUser.asStateFlow() as StateFlow<Any?>

    override fun checkAuthState() {
        _hasCheckedAuth.value = true
        _isAuthenticated.value = secureStorage.isAuthenticated()

        // If authenticated but no user, try to load it
        if (_isAuthenticated.value && _currentUser.value == null) {
            loadCurrentUser()
        }
    }

    override fun setAuthenticated(value: Boolean) {
        _isAuthenticated.value = value
    }

    override fun setCurrentUser(user: Any) {
        _currentUser.value = user as? User
        _isAuthenticated.value = true
    }

    override fun clearUser() {
        _currentUser.value = null
        _isAuthenticated.value = false
    }

    override fun loadCurrentUserIfNeeded() {
        if (_isAuthenticated.value && _currentUser.value == null) {
            loadCurrentUser()
        }
    }

    private fun loadCurrentUser() {
        CoroutineScope(Dispatchers.Main).launch {
            when (val result = authRepository.getCurrentUser()) {
                is Result.Success -> {
                    _currentUser.value = result.data
                }
                is Result.Error -> {
                    // If loading fails, clear auth state
                    clearUser()
                    secureStorage.clearAll()
                }
                is Result.Loading -> {
                    // Handle loading state if needed
                }
            }
        }
    }
}

