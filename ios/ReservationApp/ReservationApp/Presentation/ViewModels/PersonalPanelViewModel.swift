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
    
    @Published var categories: [MenuCategory] = []
    @Published var allMeals: [Meal] = []
    @Published var todayMenus: [Menu] = []
    @Published var selectedCategory: String = ""
    @Published var displayedMeals: [Meal] = []
    @Published var alertMessage: AlertMessage?
    
    private let homeRepository: HomeRepositoryProtocol
    private let authRepository: AuthRepositoryProtocol
    
    init(
        homeRepository: HomeRepositoryProtocol? = nil,
        authRepository: AuthRepositoryProtocol? = nil
    ) {
        self.homeRepository = homeRepository ?? HomeRepository()
        self.authRepository = authRepository ?? AuthRepository()
    }
    
    func loadData() async {
        isLoading = true
        errorMessage = nil
        
        async let statsTask = homeRepository.getHomeStats()
        async let userTask = authRepository.getCurrentUser()
        async let categoriesTask = homeRepository.getCategories()
        async let mealsTask = homeRepository.getMeals(restaurantId: nil, categoryId: nil)
        async let menusTask = homeRepository.getTodayMenu()
        
        do {
            let (statsResult, userResult, categoriesResult, mealsResult, menusResult) = 
                try await (statsTask, userTask, categoriesTask, mealsTask, menusTask)
            
            self.stats = statsResult
            self.user = userResult
            self.categories = categoriesResult
            self.allMeals = mealsResult
            self.todayMenus = menusResult
            
            if !categoriesResult.isEmpty && selectedCategory.isEmpty {
                let aylikMenu = categoriesResult.first { $0.name == "Aylık Menü" }
                let defaultCategory = aylikMenu?.name ?? categoriesResult.first?.name ?? ""
                selectedCategory = defaultCategory
            }
            
            filterMeals()
            generateAlertMessage()
            
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
    
    func selectCategory(_ categoryName: String) {
        selectedCategory = categoryName
        filterMeals()
    }
    
    private func filterMeals() {
        if selectedCategory.isEmpty {
            let todayMenuMeals = todayMenus.first?.meals ?? []
            displayedMeals = todayMenuMeals.isEmpty ? Array(allMeals.prefix(4)) : todayMenuMeals
        } else {
            guard let category = categories.first(where: { $0.name == selectedCategory }) else {
                let todayMenuMeals = todayMenus.first?.meals ?? []
                displayedMeals = todayMenuMeals.isEmpty ? Array(allMeals.prefix(4)) : todayMenuMeals
                return
            }
            
            if selectedCategory == "Aylık Menü" {
                let todayMenuMeals = todayMenus.first?.meals ?? []
                displayedMeals = todayMenuMeals.isEmpty ? Array(allMeals.prefix(4)) : todayMenuMeals
            } else if selectedCategory == "Japon Restoran" {
                displayedMeals = allMeals.filter { $0.restaurantName == "Japon Restoran" }
            } else {
                displayedMeals = allMeals.filter { $0.categoryId == category.id }
            }
        }
    }
    
    private func generateAlertMessage() {
        let menuMeals = todayMenus.first?.meals ?? []
        
        if menuMeals.isEmpty {
            alertMessage = AlertMessage(
                title: "Bugünün Özel Menüsü!",
                message: "Yemekhane 12:00–14:00 arası açık. Rezervasyon yapmayı unutmayın."
            )
            return
        }
        
        let hasKarniyarik = menuMeals.contains(where: { 
            $0.name.lowercased().contains("karnıyarık") || 
            $0.name.lowercased().contains("karniyarik")
        })
        
        if hasKarniyarik {
            alertMessage = AlertMessage(
                title: "Bugünün Özel Menüsü!",
                message: "Karnıyarık ile özel pilavımızı kaçırmayın. Yemekhane 12:00–14:00 arası açık."
            )
            return
        }
        
        if let firstMeal = menuMeals.first {
            alertMessage = AlertMessage(
                title: "Bugünün Özel Menüsü!",
                message: "\(firstMeal.name) kaçırmayın. Yemekhane 12:00–14:00 arası açık."
            )
        }
    }
}

