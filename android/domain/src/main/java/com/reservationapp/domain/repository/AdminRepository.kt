package com.reservationapp.domain.repository

import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.AdminCreateReservationRequest
import com.reservationapp.domain.model.AdminCreateUserRequest
import com.reservationapp.domain.model.AdminReservationQueryParams
import com.reservationapp.domain.model.CreateMealRequest
import com.reservationapp.domain.model.DailySummary
import com.reservationapp.domain.model.DashboardSummary
import com.reservationapp.domain.model.Meal
import com.reservationapp.domain.model.PaginatedResult
import com.reservationapp.domain.model.PopularMeal
import com.reservationapp.domain.model.Reservation
import com.reservationapp.domain.model.ReservationSummary
import com.reservationapp.domain.model.TodayReservationGroup
import com.reservationapp.domain.model.UpdateMealRequest
import com.reservationapp.domain.model.SettingsUpdateRequest
import com.reservationapp.domain.model.User
import com.reservationapp.domain.model.UserFilterParams
import com.reservationapp.domain.model.UserStatistics
import com.reservationapp.domain.model.UserUpdateRequest

interface AdminRepository {
    suspend fun getDashboardSummary(): Result<DashboardSummary>
    suspend fun getPopularMeals(count: Int = 4): Result<List<PopularMeal>>
    suspend fun getTodayReservations(): Result<List<TodayReservationGroup>>
    suspend fun getDailySummary(): Result<List<DailySummary>>
    
    suspend fun getAdminReservations(queryParams: AdminReservationQueryParams): Result<PaginatedResult<Reservation>>
    suspend fun getReservationSummary(): Result<ReservationSummary>
    suspend fun approveReservation(id: String): Result<Unit>
    suspend fun cancelReservation(id: String): Result<Unit>
    suspend fun createReservation(request: AdminCreateReservationRequest): Result<Reservation>
    
    suspend fun getAdminMeals(restaurantId: String?, categoryId: String?): Result<List<Meal>>
    suspend fun getMealById(id: String): Result<Meal>
    suspend fun createMeal(request: CreateMealRequest): Result<Meal>
    suspend fun updateMeal(id: String, request: UpdateMealRequest): Result<Meal>
    suspend fun deleteMeal(id: String): Result<Unit>
    
    suspend fun getUserStatistics(): Result<UserStatistics>
    suspend fun getAdminUsers(filterParams: UserFilterParams): Result<PaginatedResult<User>>
    suspend fun getUserById(id: String): Result<User>
    suspend fun createUser(request: AdminCreateUserRequest): Result<User>
    suspend fun updateUser(id: String, request: UserUpdateRequest): Result<User>
    suspend fun deleteUser(id: String): Result<Unit>
    
    suspend fun getGeneralSettings(): Result<Map<String, String>>
    suspend fun updateGeneralSettings(request: SettingsUpdateRequest): Result<Map<String, String>>
    suspend fun getReservationSettings(): Result<Map<String, String>>
    suspend fun updateReservationSettings(request: SettingsUpdateRequest): Result<Map<String, String>>
    suspend fun getNotificationSettings(): Result<Map<String, String>>
    suspend fun updateNotificationSettings(request: SettingsUpdateRequest): Result<Map<String, String>>
}

