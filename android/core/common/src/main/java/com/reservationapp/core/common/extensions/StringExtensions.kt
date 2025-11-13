package com.reservationapp.core.common.extensions

/**
 * Check if string is a valid email
 */
fun String.isValidEmail(): Boolean {
    return android.util.Patterns.EMAIL_ADDRESS.matcher(this).matches()
}

/**
 * Check if string is not blank
 */
fun String?.isNotNullOrBlank(): Boolean {
    return !this.isNullOrBlank()
}

