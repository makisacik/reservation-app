//
//  AdminDashboardViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class AdminDashboardViewModel: ObservableObject {
    @Published var summary: DashboardSummary?
    @Published var popularMeals: [PopularMeal] = []
    @Published var todayReservations: [TodayReservationGroup] = []
    @Published var weeklyTrends: [WeeklyTrend] = []
    @Published var dailySummary: [DailySummary] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let adminRepository: AdminRepositoryProtocol
    
    init(adminRepository: AdminRepositoryProtocol = AdminRepository()) {
        self.adminRepository = adminRepository
    }
    
    func loadDashboardData() async {
        isLoading = true
        errorMessage = nil
        
        async let summaryTask = adminRepository.getDashboardSummary()
        async let popularMealsTask = adminRepository.getPopularMeals(count: 4)
        async let todayReservationsTask = adminRepository.getTodayReservations()
        async let dailySummaryTask = adminRepository.getDailySummary()
        
        do {
            let (summaryResult, popularMealsResult, todayReservationsResult, dailySummaryResult) =
                try await (summaryTask, popularMealsTask, todayReservationsTask, dailySummaryTask)
            
            self.summary = summaryResult
            self.popularMeals = popularMealsResult
            self.todayReservations = todayReservationsResult
            self.dailySummary = dailySummaryResult
        } catch {
            errorMessage = "Dashboard verileri yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func refresh() async {
        await loadDashboardData()
    }
}

