package com.reservationapp

import android.content.Context
import com.google.gson.Gson
import com.reservationapp.core.network.AuthInterceptor
import com.reservationapp.core.network.RetrofitModule
import com.reservationapp.core.network.api.AdminApi
import com.reservationapp.core.network.api.AuthApi
import com.reservationapp.core.network.api.HomeApi
import com.reservationapp.core.network.api.ReservationApi
import com.reservationapp.core.storage.SecureStorage
import com.reservationapp.data.repository.AdminRepositoryImpl
import com.reservationapp.data.repository.AuthRepositoryImpl
import com.reservationapp.data.repository.HomeRepositoryImpl
import com.reservationapp.data.repository.ReservationRepositoryImpl
import com.reservationapp.domain.repository.AdminRepository
import com.reservationapp.domain.repository.AuthRepository
import com.reservationapp.domain.repository.HomeRepository
import com.reservationapp.domain.repository.ReservationRepository
import okhttp3.OkHttpClient
import retrofit2.Retrofit

/**
 * Dependency container for manual dependency injection
 * This is a singleton that provides all dependencies
 */
object DependencyContainer {

    private var context: Context? = null
    private var secureStorage: SecureStorage? = null
    private var gson: Gson? = null
    private var authInterceptor: AuthInterceptor? = null
    private var okHttpClient: OkHttpClient? = null
    private var retrofit: Retrofit? = null
    private var authApi: AuthApi? = null
    private var authRepository: AuthRepository? = null
    private var authStateManager: AuthStateManager? = null
    private var homeApi: HomeApi? = null
    private var homeRepository: HomeRepository? = null
    private var reservationApi: ReservationApi? = null
    private var reservationRepository: ReservationRepository? = null
    private var adminApi: AdminApi? = null
    private var adminRepository: AdminRepository? = null

    fun initialize(appContext: Context) {
        context = appContext.applicationContext

        // Initialize in order
        secureStorage = SecureStorage(appContext)
        gson = RetrofitModule.provideGson()
        authInterceptor = AuthInterceptor(
            tokenProvider = { secureStorage?.getAuthToken() }
        )
        okHttpClient = RetrofitModule.provideOkHttpClient(authInterceptor)
        retrofit = RetrofitModule.provideRetrofit(okHttpClient!!, gson!!)
        authApi = retrofit!!.create(AuthApi::class.java)
        authRepository = AuthRepositoryImpl(authApi!!, secureStorage!!)
        authStateManager = AuthStateManager(secureStorage!!, authRepository!!)
        
        // Initialize Home API and Repository
        homeApi = retrofit!!.create(HomeApi::class.java)
        homeRepository = HomeRepositoryImpl(homeApi!!)
        
        // Initialize Reservation API and Repository
        reservationApi = retrofit!!.create(ReservationApi::class.java)
        reservationRepository = ReservationRepositoryImpl(reservationApi!!)
        
        // Initialize Admin API and Repository
        adminApi = retrofit!!.create(AdminApi::class.java)
        adminRepository = AdminRepositoryImpl(adminApi!!)
    }

    fun getSecureStorage(): SecureStorage {
        return secureStorage ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getAuthRepository(): AuthRepository {
        return authRepository ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getAuthStateManager(): AuthStateManager {
        return authStateManager ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getAuthApi(): AuthApi {
        return authApi ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getHomeRepository(): HomeRepository {
        return homeRepository ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getReservationApi(): ReservationApi {
        return reservationApi ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getReservationRepository(): ReservationRepository {
        return reservationRepository ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getAdminApi(): AdminApi {
        return adminApi ?: throw IllegalStateException("DependencyContainer not initialized")
    }

    fun getAdminRepository(): AdminRepository {
        return adminRepository ?: throw IllegalStateException("DependencyContainer not initialized")
    }
}

