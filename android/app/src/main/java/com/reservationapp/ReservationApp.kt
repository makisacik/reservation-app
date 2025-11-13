package com.reservationapp

import android.app.Application
import timber.log.Timber

// @HiltAndroidApp - Temporarily disabled due to KAPT/Java 17 compatibility issues
class ReservationApp : Application() {
    override fun onCreate() {
        super.onCreate()

        // Initialize Timber for logging
        Timber.plant(Timber.DebugTree())
    }
}

