//
//  SettingsRepository.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

class SettingsRepository: SettingsRepositoryProtocol {
    private let apiClient: APIClient
    
    nonisolated init(apiClient: APIClient = APIClient.shared) {
        self.apiClient = apiClient
    }
    
    func getGeneralSettings() async throws -> [String: String] {
        return try await apiClient.request(
            endpoint: .adminGeneralSettings,
            responseType: [String: String].self
        )
    }
    
    func updateGeneralSettings(_ settings: [String: String]) async throws -> [String: String] {
        let request = SettingsUpdateRequest(settings: settings)
        return try await apiClient.request(
            endpoint: .adminUpdateGeneralSettings,
            method: "PUT",
            body: request,
            responseType: [String: String].self
        )
    }
    
    func getReservationSettings() async throws -> [String: String] {
        return try await apiClient.request(
            endpoint: .adminReservationSettings,
            responseType: [String: String].self
        )
    }
    
    func updateReservationSettings(_ settings: [String: String]) async throws -> [String: String] {
        let request = SettingsUpdateRequest(settings: settings)
        return try await apiClient.request(
            endpoint: .adminUpdateReservationSettings,
            method: "PUT",
            body: request,
            responseType: [String: String].self
        )
    }
    
    func getNotificationSettings() async throws -> [String: String] {
        return try await apiClient.request(
            endpoint: .adminNotificationSettings,
            responseType: [String: String].self
        )
    }
    
    func updateNotificationSettings(_ settings: [String: String]) async throws -> [String: String] {
        let request = SettingsUpdateRequest(settings: settings)
        return try await apiClient.request(
            endpoint: .adminUpdateNotificationSettings,
            method: "PUT",
            body: request,
            responseType: [String: String].self
        )
    }
}

struct SettingsUpdateRequest: Codable {
    let settings: [String: String]
}

