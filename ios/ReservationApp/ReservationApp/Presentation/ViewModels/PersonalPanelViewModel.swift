//
//  PersonalPanelViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class PersonalPanelViewModel: ObservableObject {
    @Published var stats: HomePageStats?
    @Published var user: User?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let homeRepository: HomeRepositoryProtocol
    private let authRepository: AuthRepositoryProtocol
    
    init(
        homeRepository: HomeRepositoryProtocol? = nil,
        authRepository: AuthRepositoryProtocol? = nil
    ) {
        // Create dependencies on main actor to avoid concurrency issues
        self.homeRepository = homeRepository ?? HomeRepository()
        self.authRepository = authRepository ?? AuthRepository()
    }
    
    func loadData() async {
        isLoading = true
        errorMessage = nil
        
        async let statsTask = homeRepository.getHomeStats()
        async let userTask = authRepository.getCurrentUser()
        
        do {
            let (statsResult, userResult) = try await (statsTask, userTask)
            self.stats = statsResult
            self.user = userResult
        } catch let error as NetworkError {
            errorMessage = error.errorDescription ?? "Veriler yüklenirken bir hata oluştu."
        } catch {
            errorMessage = "Veriler yüklenirken bir hata oluştu: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    func refresh() async {
        await loadData()
    }
}

