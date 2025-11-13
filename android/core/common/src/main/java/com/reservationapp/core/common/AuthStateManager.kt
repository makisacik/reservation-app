package com.reservationapp.core.common

import kotlinx.coroutines.flow.StateFlow

/**
 * Interface for authentication state management
 * Implemented in app module
 * Uses Any? for currentUser to avoid circular dependency with domain module
 */
interface AuthStateManager {
    val isAuthenticated: StateFlow<Boolean>
    val hasCheckedAuth: StateFlow<Boolean>
    val currentUser: StateFlow<Any?>

    fun checkAuthState()
    fun setAuthenticated(value: Boolean)
    fun setCurrentUser(user: Any)
    fun clearUser()
    fun loadCurrentUserIfNeeded()
}

