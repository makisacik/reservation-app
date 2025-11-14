package com.reservationapp.core.network.api

import com.reservationapp.domain.model.HomePageStats
import com.reservationapp.domain.model.Meal
import com.reservationapp.domain.model.Menu
import com.reservationapp.domain.model.MenuCategory
import com.reservationapp.domain.model.Restaurant
import retrofit2.http.GET
import retrofit2.http.Query

interface HomeApi {
    @GET("home/stats")
    suspend fun getHomeStats(): HomePageStats

    @GET("menu-categories")
    suspend fun getCategories(): List<MenuCategory>

    @GET("meals")
    suspend fun getMeals(
        @Query("restaurantId") restaurantId: String? = null,
        @Query("categoryId") categoryId: String? = null
    ): List<Meal>

    @GET("menus")
    suspend fun getTodayMenu(
        @Query("date") date: String? = null
    ): List<Menu>

    @GET("restaurants")
    suspend fun getRestaurants(): List<Restaurant>
}

