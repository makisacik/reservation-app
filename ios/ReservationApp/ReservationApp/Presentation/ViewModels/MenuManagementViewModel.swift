//
//  MenuManagementViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class MenuManagementViewModel: ObservableObject {
    @Published var meals: [Meal] = []
    @Published var filteredMeals: [Meal] = []
    @Published var categories: [MenuCategory] = []
    @Published var restaurants: [Restaurant] = []
    
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var successMessage: String?
    
    // Filters
    @Published var searchQuery: String = "" {
        didSet {
            applyFilters()
        }
    }
    @Published var selectedRestaurantId: String = "" {
        didSet {
            Task {
                await loadData()
            }
        }
    }
    @Published var selectedCategoryTab: CategoryTab = .all {
        didSet {
            applyFilters()
        }
    }
    
    // Modal state
    @Published var showMealForm = false
    @Published var editingMeal: Meal?
    @Published var showDeleteConfirmation = false
    @Published var mealToDelete: Meal?
    
    private let adminRepository: AdminRepositoryProtocol
    private let homeRepository: HomeRepositoryProtocol
    
    init(
        adminRepository: AdminRepositoryProtocol = AdminRepository(),
        homeRepository: HomeRepositoryProtocol = HomeRepository()
    ) {
        self.adminRepository = adminRepository
        self.homeRepository = homeRepository
    }
    
    func loadData() async {
        isLoading = true
        errorMessage = nil
        
        async let mealsTask = adminRepository.getAdminMeals(
            restaurantId: selectedRestaurantId.isEmpty ? nil : selectedRestaurantId,
            categoryId: nil
        )
        async let categoriesTask = homeRepository.getCategories()
        async let restaurantsTask = homeRepository.getRestaurants()
        
        do {
            let (mealsResult, categoriesResult, restaurantsResult) =
                try await (mealsTask, categoriesTask, restaurantsTask)
            
            self.meals = mealsResult
            self.categories = categoriesResult
            self.restaurants = restaurantsResult
            
            applyFilters()
        } catch {
            errorMessage = "Veriler yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func applyFilters() {
        var filtered = meals
        
        // Search filter
        if !searchQuery.trimmingCharacters(in: .whitespaces).isEmpty {
            let query = searchQuery.lowercased()
            filtered = filtered.filter { $0.name.lowercased().contains(query) }
        }
        
        // Category tab filter
        switch selectedCategoryTab {
        case .all:
            break // No filter
        case .yemekhane:
            filtered = filtered.filter { $0.restaurantName == "Yemekhane" }
        case .alakart:
            filtered = filtered.filter { $0.categoryName == "Alakart" }
        case .japon:
            filtered = filtered.filter { $0.restaurantName == "Japon Restoran" }
        }
        
        filteredMeals = filtered
    }
    
    func createMeal(_ request: CreateMealRequest) async {
        isLoading = true
        errorMessage = nil
        
        do {
            _ = try await adminRepository.createMeal(mealData: request)
            successMessage = "Menü başarıyla oluşturuldu"
            await loadData()
            showMealForm = false
            editingMeal = nil
        } catch {
            errorMessage = "Menü oluşturulurken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func updateMeal(id: String, _ request: UpdateMealRequest) async {
        isLoading = true
        errorMessage = nil
        
        do {
            _ = try await adminRepository.updateMeal(id: id, mealData: request)
            successMessage = "Menü başarıyla güncellendi"
            await loadData()
            showMealForm = false
            editingMeal = nil
        } catch {
            errorMessage = "Menü güncellenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func deleteMeal(_ meal: Meal) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await adminRepository.deleteMeal(id: meal.id)
            successMessage = "Menü başarıyla silindi"
            await loadData()
            showDeleteConfirmation = false
            mealToDelete = nil
        } catch {
            errorMessage = "Menü silinirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func openCreateForm() {
        editingMeal = nil
        showMealForm = true
    }
    
    func openEditForm(_ meal: Meal) {
        editingMeal = meal
        showMealForm = true
    }
    
    func confirmDelete(_ meal: Meal) {
        mealToDelete = meal
        showDeleteConfirmation = true
    }
}

enum CategoryTab: String, CaseIterable {
    case all = "all"
    case yemekhane = "yemekhane"
    case alakart = "alakart"
    case japon = "japon"
    
    var displayName: String {
        switch self {
        case .all: return "Tümü"
        case .yemekhane: return "Yemekhane"
        case .alakart: return "Alakart"
        case .japon: return "Japon"
        }
    }
}



