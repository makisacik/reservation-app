//
//  ReservationRepository.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

class ReservationRepository: ReservationRepositoryProtocol {
    private let apiClient: APIClient
    
    nonisolated init(apiClient: APIClient = APIClient.shared) {
        self.apiClient = apiClient
    }
    
    func getMyReservations() async throws -> [Reservation] {
        return try await apiClient.request(
            endpoint: .myReservations,
            responseType: [Reservation].self
        )
    }
    
    func createReservation(_ reservation: CreateReservationRequest) async throws -> Reservation {
        return try await apiClient.request(
            endpoint: .createReservation,
            method: "POST",
            body: reservation,
            responseType: Reservation.self
        )
    }
    
    func cancelReservation(id: String) async throws {
        // Note: Need to add DELETE endpoint support to APIClient
        // For now, this is a placeholder
        // TODO: Implement DELETE method support in APIClient and update this method
        _ = try await apiClient.request(
            endpoint: .createReservation, // Placeholder
            responseType: EmptyResponse.self
        )
    }
}

// Request model for creating reservation
struct CreateReservationRequest: Codable {
    let restaurantId: String
    let menuId: String
    let mealTimeSlotId: Int
    let date: String // ISO 8601 datetime string
    let appetizer: Bool
}

