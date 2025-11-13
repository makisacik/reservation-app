//
//  AdminRepository.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

class AdminRepository: AdminRepositoryProtocol {
    private let apiClient: APIClient
    
    nonisolated init(apiClient: APIClient = APIClient.shared) {
        self.apiClient = apiClient
    }
    
    // MARK: - Dashboard methods
    
    func getDashboardSummary() async throws -> DashboardSummary {
        return try await apiClient.request(
            endpoint: .adminDashboardSummary,
            responseType: DashboardSummary.self
        )
    }
    
    func getPopularMeals(count: Int) async throws -> [PopularMeal] {
        return try await apiClient.request(
            endpoint: .adminPopularMeals,
            queryParams: ["count": "\(count)"],
            responseType: [PopularMeal].self
        )
    }
    
    func getTodayReservations() async throws -> [TodayReservationGroup] {
        return try await apiClient.request(
            endpoint: .adminTodayReservations,
            responseType: [TodayReservationGroup].self
        )
    }
    
    func getWeeklyTrends(startDate: String?, endDate: String?) async throws -> [WeeklyTrend] {
        var queryParams: [String: String] = [:]
        if let startDate = startDate {
            queryParams["startDate"] = startDate
        }
        if let endDate = endDate {
            queryParams["endDate"] = endDate
        }
        
        return try await apiClient.request(
            endpoint: .adminWeeklyTrends,
            queryParams: queryParams.isEmpty ? nil : queryParams,
            responseType: [WeeklyTrend].self
        )
    }
    
    func getDailySummary() async throws -> [DailySummary] {
        return try await apiClient.request(
            endpoint: .adminDailySummary,
            responseType: [DailySummary].self
        )
    }
    
    // MARK: - Reservations methods
    
    func getAdminReservations(queryParams: AdminReservationQueryParams) async throws -> PaginatedResult<Reservation> {
        var queryItems: [String: String] = [
            "page": "\(queryParams.page)",
            "pageSize": "\(queryParams.pageSize)"
        ]
        
        if let dateFrom = queryParams.dateFrom {
            queryItems["dateFrom"] = dateFrom
        }
        if let dateTo = queryParams.dateTo {
            queryItems["dateTo"] = dateTo
        }
        if let search = queryParams.search {
            queryItems["search"] = search
        }
        if let status = queryParams.status {
            queryItems["status"] = status
        }
        
        return try await apiClient.request(
            endpoint: .adminReservations,
            queryParams: queryItems,
            responseType: PaginatedResult<Reservation>.self
        )
    }
    
    func approveReservation(id: String) async throws {
        _ = try await apiClient.request(
            endpoint: .adminApproveReservation(id: id),
            method: "PUT",
            responseType: EmptyResponse.self
        )
    }
    
    func cancelReservation(id: String) async throws {
        _ = try await apiClient.request(
            endpoint: .adminCancelReservation(id: id),
            method: "PUT",
            responseType: EmptyResponse.self
        )
    }
    
    func getReservationSummary() async throws -> ReservationSummary {
        return try await apiClient.request(
            endpoint: .reservationSummary,
            responseType: ReservationSummary.self
        )
    }
    
    func getReservationById(id: String) async throws -> Reservation {
        return try await apiClient.request(
            endpoint: .getReservationById(id: id),
            responseType: Reservation.self
        )
    }
    
    func createReservation(reservationData: AdminCreateReservationRequest) async throws -> Reservation {
        return try await apiClient.request(
            endpoint: .createReservation,
            method: "POST",
            body: reservationData,
            responseType: Reservation.self
        )
    }
    
    // MARK: - Users methods (to be implemented in later phases)
    
    func getAdminUsers(queryParams: UserFilterParams) async throws -> PaginatedResult<User> {
        // TODO: Implement when users management view is added
        throw NetworkError.unknown
    }
    
    func getUserStatistics() async throws -> UserStatistics {
        // TODO: Implement when users management view is added
        throw NetworkError.unknown
    }
    
    func createUser(userData: CreateUserRequest) async throws -> User {
        // TODO: Implement when users management view is added
        throw NetworkError.unknown
    }
    
    func updateUser(id: String, userData: UpdateUserRequest) async throws -> User {
        // TODO: Implement when users management view is added
        throw NetworkError.unknown
    }
    
    func deleteUser(id: String) async throws {
        // TODO: Implement when users management view is added
        throw NetworkError.unknown
    }
    
    // MARK: - Meals methods
    
    func getAdminMeals(restaurantId: String?, categoryId: String?) async throws -> [Meal] {
        var queryParams: [String: String] = [:]

        if let restaurantId = restaurantId {
            queryParams["restaurantId"] = restaurantId
        }
        if let categoryId = categoryId {
            queryParams["categoryId"] = categoryId
        }

        return try await apiClient.request(
            endpoint: .adminMeals,
            queryParams: queryParams.isEmpty ? nil : queryParams,
            responseType: [Meal].self
        )
    }
    
    func createMeal(mealData: CreateMealRequest) async throws -> Meal {
        return try await apiClient.request(
            endpoint: .adminCreateMeal,
            method: "POST",
            body: mealData,
            responseType: Meal.self
        )
    }
    
    func updateMeal(id: String, mealData: UpdateMealRequest) async throws -> Meal {
        return try await apiClient.request(
            endpoint: .adminUpdateMeal(id: id),
            method: "PUT",
            body: mealData,
            responseType: Meal.self
        )
    }
    
    func deleteMeal(id: String) async throws {
        _ = try await apiClient.request(
            endpoint: .adminDeleteMeal(id: id),
            method: "DELETE",
            responseType: EmptyResponse.self
        )
    }
}

