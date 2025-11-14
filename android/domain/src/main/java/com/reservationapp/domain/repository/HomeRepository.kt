package com.reservationapp.domain.repository

import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.HomePageStats
import com.reservationapp.domain.model.Meal
import com.reservationapp.domain.model.MealTimeSlot
import com.reservationapp.domain.model.Menu
import com.reservationapp.domain.model.MenuCategory
import com.reservationapp.domain.model.Restaurant

interface HomeRepository {
    suspend fun getHomeStats(): Result<HomePageStats>
    suspend fun getCategories(): Result<List<MenuCategory>>
    suspend fun getMeals(restaurantId: String? = null, categoryId: String? = null): Result<List<Meal>>
    suspend fun getTodayMenu(): Result<List<Menu>>
    suspend fun getRestaurants(): Result<List<Restaurant>>
    suspend fun getMealTimeSlots(): Result<List<MealTimeSlot>>
    suspend fun getMenus(date: String, restaurantId: String): Result<List<Menu>>
}

