package com.reservationapp

import android.app.Application
import timber.log.Timber

class ReservationApp : Application() {
    override fun onCreate() {
        super.onCreate()

        // Initialize dependency container
        DependencyContainer.initialize(this)

        // Initialize Timber for logging
        Timber.plant(Timber.DebugTree())
    }
}

