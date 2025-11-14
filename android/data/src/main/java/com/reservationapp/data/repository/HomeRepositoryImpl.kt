package com.reservationapp.data.repository

import com.reservationapp.core.common.Result
import com.reservationapp.core.network.api.HomeApi
import com.reservationapp.core.network.safeApiCall
import com.reservationapp.domain.model.HomePageStats
import com.reservationapp.domain.model.Meal
import com.reservationapp.domain.model.Menu
import com.reservationapp.domain.model.MenuCategory
import com.reservationapp.domain.model.Restaurant
import com.reservationapp.domain.repository.HomeRepository
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class HomeRepositoryImpl(
    private val homeApi: HomeApi
) : HomeRepository {

    override suspend fun getHomeStats(): Result<HomePageStats> {
        return safeApiCall {
            homeApi.getHomeStats()
        }
    }

    override suspend fun getCategories(): Result<List<MenuCategory>> {
        return safeApiCall {
            homeApi.getCategories()
        }
    }

    override suspend fun getMeals(restaurantId: String?, categoryId: String?): Result<List<Meal>> {
        return safeApiCall {
            homeApi.getMeals(restaurantId, categoryId)
        }
    }

    override suspend fun getTodayMenu(): Result<List<Menu>> {
        return safeApiCall {
            // Format today's date as yyyy-MM-dd for the backend
            val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            homeApi.getTodayMenu(today)
        }
    }

    override suspend fun getRestaurants(): Result<List<Restaurant>> {
        return safeApiCall {
            homeApi.getRestaurants()
        }
    }
}

