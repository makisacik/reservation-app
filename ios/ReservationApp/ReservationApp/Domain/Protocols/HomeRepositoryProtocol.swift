//
//  HomeRepositoryProtocol.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

protocol HomeRepositoryProtocol {
    func getHomeStats() async throws -> HomePageStats
    func getCategories() async throws -> [MenuCategory]
    func getMeals(restaurantId: String?, categoryId: String?) async throws -> [Meal]
    func getTodayMenu() async throws -> [Menu]
    func getRestaurants() async throws -> [Restaurant]
    func getMealTimeSlots() async throws -> [MealTimeSlot]
    func getMenus(date: String, restaurantId: String, menuType: MenuType) async throws -> [Menu]
}

