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
}

