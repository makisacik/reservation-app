//
//  AdminRepositoryProtocol.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import Combine

protocol AdminRepositoryProtocol {
    // Dashboard
    func getDashboardSummary() async throws -> DashboardSummary
    func getPopularMeals(count: Int) async throws -> [PopularMeal]
    func getTodayReservations() async throws -> [TodayReservationGroup]
    func getWeeklyTrends(startDate: String?, endDate: String?) async throws -> [WeeklyTrend]
    func getDailySummary() async throws -> [DailySummary]
    
    // Reservations
    func getAdminReservations(queryParams: AdminReservationQueryParams) async throws -> PaginatedResult<Reservation>
    func approveReservation(id: String) async throws
    func cancelReservation(id: String) async throws
    func getReservationSummary() async throws -> ReservationSummary
    func getReservationById(id: String) async throws -> Reservation
    func createReservation(reservationData: AdminCreateReservationRequest) async throws -> Reservation
    
    // Users
    func getAdminUsers(queryParams: UserFilterParams) async throws -> PaginatedResult<User>
    func getUserStatistics() async throws -> UserStatistics
    func createUser(userData: CreateUserRequest) async throws -> User
    func updateUser(id: String, userData: UpdateUserRequest) async throws -> User
    func deleteUser(id: String) async throws
    
    // Meals
    func getAdminMeals(restaurantId: String?, categoryId: String?) async throws -> [Meal]
    func createMeal(mealData: CreateMealRequest) async throws -> Meal
    func updateMeal(id: String, mealData: UpdateMealRequest) async throws -> Meal
    func deleteMeal(id: String) async throws
}

// Query parameter models
struct AdminReservationQueryParams {
    let page: Int
    let pageSize: Int
    let dateFrom: String?
    let dateTo: String?
    let search: String?
    let status: String?
}

struct UserFilterParams {
    let page: Int
    let pageSize: Int
    let search: String?
}

struct PaginatedResult<T: Codable>: Codable {
    let data: [T]
    let totalCount: Int
    let page: Int
    let pageSize: Int
}

struct ReservationSummary: Codable {
    let todayCount: Int
    let thisWeekCount: Int
    let thisMonthCount: Int
    let pendingCount: Int
}

// Request models
struct CreateUserRequest: Codable {
    let name: String
    let email: String
    let password: String
    let department: String?
    let role: String // "User" or "Admin"
}

struct UpdateUserRequest: Codable {
    let name: String
    let email: String
    let department: String?
    let role: String
    let status: String // "Active" or "Passive"
}

struct CreateMealRequest: Codable {
    let name: String
    let categoryId: String
    let restaurantId: String
    let description: String?
    let price: Double?
    let kcal: Int?
    let imageUrl: String?
}

struct UpdateMealRequest: Codable {
    let name: String
    let categoryId: String
    let description: String?
    let price: Double?
    let kcal: Int?
    let imageUrl: String?
}

struct AdminCreateReservationRequest: Codable {
    let userId: String
    let restaurantId: String
    let menuId: String
    let mealTimeSlotId: Int
    let date: String // ISO 8601 datetime
    let appetizer: Bool
}

