//
//  HomeRepository.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

class HomeRepository: HomeRepositoryProtocol {
    private let apiClient: APIClient
    
    nonisolated init(apiClient: APIClient = APIClient.shared) {
        self.apiClient = apiClient
    }
    
    func getHomeStats() async throws -> HomePageStats {
        return try await apiClient.request(
            endpoint: .homeStats,
            responseType: HomePageStats.self
        )
    }
    
    func getCategories() async throws -> [MenuCategory] {
        return try await apiClient.request(
            endpoint: .menuCategories,
            responseType: [MenuCategory].self
        )
    }
    
    func getMeals(restaurantId: String? = nil, categoryId: String? = nil) async throws -> [Meal] {
        var queryParams: [String: String] = [:]
        
        if let restaurantId = restaurantId {
            queryParams["restaurantId"] = restaurantId
        }
        
        if let categoryId = categoryId {
            queryParams["categoryId"] = categoryId
        }
        
        return try await apiClient.request(
            endpoint: .meals,
            queryParams: queryParams.isEmpty ? nil : queryParams,
            responseType: [Meal].self
        )
    }
    
    func getTodayMenu() async throws -> [Menu] {
        let today = Date()
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withFullDate]
        let dateString = formatter.string(from: today)
        
        return try await apiClient.request(
            endpoint: .menus,
            queryParams: ["date": dateString],
            responseType: [Menu].self
        )
    }
    
    func getRestaurants() async throws -> [Restaurant] {
        return try await apiClient.request(
            endpoint: .restaurants,
            responseType: [Restaurant].self
        )
    }
    
    func getMealTimeSlots() async throws -> [MealTimeSlot] {
        return try await apiClient.request(
            endpoint: .mealTimeSlots,
            responseType: [MealTimeSlot].self
        )
    }
    
    func getMenus(date: String, restaurantId: String, menuType: MenuType) async throws -> [Menu] {
        let queryParams: [String: String] = [
            "date": date,
            "restaurantId": restaurantId
        ]
        
        // Fetch menus from API
        let allMenus = try await apiClient.request(
            endpoint: .menus,
            queryParams: queryParams,
            responseType: [Menu].self
        )
        
        // Filter by menuType client-side (backend may not support menuType filter yet)
        // Backend sends menuType as string: "Standard" or "Special"
        let menuTypeString = menuType == .standard ? "Standard" : "Special"
        return allMenus.filter { $0.menuType == menuTypeString }
    }
}

