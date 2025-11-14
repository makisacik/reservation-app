package com.reservationapp.data.repository

import com.reservationapp.core.common.Result
import com.reservationapp.core.network.api.AdminApi
import com.reservationapp.core.network.safeApiCall
import com.reservationapp.domain.model.AdminCreateReservationRequest
import com.reservationapp.domain.model.AdminReservationQueryParams
import com.reservationapp.domain.model.DailySummary
import com.reservationapp.domain.model.DashboardSummary
import com.reservationapp.domain.model.PaginatedResult
import com.reservationapp.domain.model.PopularMeal
import com.reservationapp.domain.model.Reservation
import com.reservationapp.domain.model.ReservationSummary
import com.reservationapp.domain.model.TodayReservationGroup
import com.reservationapp.domain.repository.AdminRepository

class AdminRepositoryImpl(
    private val adminApi: AdminApi
) : AdminRepository {

    override suspend fun getDashboardSummary(): Result<DashboardSummary> {
        return safeApiCall {
            adminApi.getDashboardSummary()
        }
    }

    override suspend fun getPopularMeals(count: Int): Result<List<PopularMeal>> {
        return safeApiCall {
            adminApi.getPopularMeals(count)
        }
    }

    override suspend fun getTodayReservations(): Result<List<TodayReservationGroup>> {
        return safeApiCall {
            adminApi.getTodayReservations()
        }
    }

    override suspend fun getDailySummary(): Result<List<DailySummary>> {
        return safeApiCall {
            adminApi.getDailySummary()
        }
    }

    override suspend fun getAdminReservations(queryParams: AdminReservationQueryParams): Result<PaginatedResult<Reservation>> {
        return safeApiCall {
            adminApi.getAdminReservations(
                page = queryParams.page,
                pageSize = queryParams.pageSize,
                dateFrom = queryParams.dateFrom,
                dateTo = queryParams.dateTo,
                search = queryParams.search,
                status = queryParams.status
            )
        }
    }

    override suspend fun getReservationSummary(): Result<ReservationSummary> {
        return safeApiCall {
            adminApi.getReservationSummary()
        }
    }

    override suspend fun approveReservation(id: String): Result<Unit> {
        return safeApiCall {
            adminApi.approveReservation(id)
        }
    }

    override suspend fun cancelReservation(id: String): Result<Unit> {
        return safeApiCall {
            adminApi.cancelReservation(id)
        }
    }

    override suspend fun createReservation(request: AdminCreateReservationRequest): Result<Reservation> {
        return safeApiCall {
            adminApi.createReservation(request)
        }
    }
}

