package com.reservationapp.core.network.api

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
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface AdminApi {
    @GET("admin/dashboard/summary")
    suspend fun getDashboardSummary(): DashboardSummary

    @GET("admin/dashboard/popular-meals")
    suspend fun getPopularMeals(
        @Query("count") count: Int = 10
    ): List<PopularMeal>

    @GET("admin/dashboard/today-reservations")
    suspend fun getTodayReservations(): List<TodayReservationGroup>

    @GET("admin/dashboard/daily-summary")
    suspend fun getDailySummary(): List<DailySummary>

    @GET("admin/reservations")
    suspend fun getAdminReservations(
        @Query("page") page: Int,
        @Query("pageSize") pageSize: Int,
        @Query("dateFrom") dateFrom: String?,
        @Query("dateTo") dateTo: String?,
        @Query("search") search: String?,
        @Query("status") status: String?
    ): PaginatedResult<Reservation>

    @GET("admin/reservations/summary")
    suspend fun getReservationSummary(): ReservationSummary

    @PUT("admin/reservations/{id}/approve")
    suspend fun approveReservation(@Path("id") id: String): Unit

    @PUT("admin/reservations/{id}/cancel")
    suspend fun cancelReservation(@Path("id") id: String): Unit

    @POST("admin/reservations")
    suspend fun createReservation(@Body request: AdminCreateReservationRequest): Reservation

    @GET("admin/meals")
    suspend fun getAdminMeals(
        @Query("restaurantId") restaurantId: String? = null,
        @Query("categoryId") categoryId: String? = null
    ): List<Meal>

    @GET("admin/meals/{id}")
    suspend fun getMealById(@Path("id") id: String): Meal

    @POST("admin/meals")
    suspend fun createMeal(@Body request: CreateMealRequest): Meal

    @PUT("admin/meals/{id}")
    suspend fun updateMeal(@Path("id") id: String, @Body request: UpdateMealRequest): Meal

    @DELETE("admin/meals/{id}")
    suspend fun deleteMeal(@Path("id") id: String): Unit
}

