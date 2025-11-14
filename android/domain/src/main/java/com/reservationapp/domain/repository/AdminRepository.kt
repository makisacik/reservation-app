package com.reservationapp.domain.repository

import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.AdminCreateReservationRequest
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
}

