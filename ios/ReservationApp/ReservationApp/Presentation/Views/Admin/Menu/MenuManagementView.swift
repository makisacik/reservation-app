//
//  MenuManagementView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct MenuManagementView: View {
    @StateObject private var viewModel = MenuManagementViewModel()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ThemeManager.shared.spacing.lg) {
                    // Header
                    VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                        Text("Menü Yönetimi")
                            .font(AppTypography.h4())
                            .foregroundColor(AppColors.textPrimary)
                        
                        Text("Yemek menülerini düzenleyin ve yönetin")
                            .font(AppTypography.body2())
                            .foregroundColor(AppColors.textSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    
                    // Filters
                    MealFiltersView(viewModel: viewModel)
                    
                    // Category Tabs
                    MenuCategoryTabsView(
                        selectedTab: $viewModel.selectedCategoryTab
                    ) { tab in
                        viewModel.applyFilters()
                    }
                    
                    // Meals Grid
                    if viewModel.isLoading && viewModel.filteredMeals.isEmpty {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                            .padding(ThemeManager.shared.spacing.xl)
                    } else if viewModel.filteredMeals.isEmpty {
                        AdminEmptyMealsView(
                            hasFilters: !viewModel.searchQuery.isEmpty ||
                                       viewModel.selectedCategoryTab != .all ||
                                      !viewModel.selectedRestaurantId.isEmpty
                        )
                    } else {
                        LazyVStack(spacing: ThemeManager.shared.spacing.md) {
                            ForEach(viewModel.filteredMeals) { meal in
                                AdminMealCardView(
                                    meal: meal,
                                    onEdit: {
                                        viewModel.openEditForm(meal)
                                    },
                                    onDelete: {
                                        viewModel.confirmDelete(meal)
                                    }
                                )
                            }
                        }
                    }
                }
                .padding(ThemeManager.shared.spacing.md)
            }
            .background(AppColors.backgroundPage)
            .refreshable {
                await viewModel.loadData()
            }
            .task {
                await viewModel.loadData()
            }
            .sheet(isPresented: $viewModel.showMealForm) {
                MealFormView(
                    isPresented: $viewModel.showMealForm,
                    viewModel: viewModel
                )
            }
            .alert("Menü Sil", isPresented: $viewModel.showDeleteConfirmation) {
                Button("İptal", role: .cancel) {
                    viewModel.mealToDelete = nil
                }
                Button("Sil", role: .destructive) {
                    if let meal = viewModel.mealToDelete {
                        Task {
                            await viewModel.deleteMeal(meal)
                        }
                    }
                }
            } message: {
                if let meal = viewModel.mealToDelete {
                    Text("\"\(meal.name)\" menüsünü silmek istediğinize emin misiniz?")
                }
            }
            .alert("Hata", isPresented: .constant(viewModel.errorMessage != nil)) {
                Button("Tamam") {
                    viewModel.errorMessage = nil
                }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
            .alert("Başarılı", isPresented: .constant(viewModel.successMessage != nil)) {
                Button("Tamam") {
                    viewModel.successMessage = nil
                }
            } message: {
                Text(viewModel.successMessage ?? "")
            }
        }
    }
}

struct AdminEmptyMealsView: View {
    let hasFilters: Bool
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            Image(systemName: "fork.knife")
                .font(.system(size: 48))
                .foregroundColor(AppColors.textTertiary)
            
            Text(hasFilters
                 ? "Arama kriterlerinize uygun menü bulunamadı"
                 : "Henüz menü eklenmemiş")
                .font(AppTypography.body1())
                .foregroundColor(AppColors.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.xl)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
    }
}

