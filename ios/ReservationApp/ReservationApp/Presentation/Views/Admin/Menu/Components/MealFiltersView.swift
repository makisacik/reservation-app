//
//  MealFiltersView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct MealFiltersView: View {
    @ObservedObject var viewModel: MenuManagementViewModel
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            // Search Bar
            HStack(spacing: ThemeManager.shared.spacing.sm) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(AppColors.textTertiary)
                
                TextField(
                    "Q Menü ara...",
                    text: $viewModel.searchQuery
                )
                .textFieldStyle(PlainTextFieldStyle())
                .font(AppTypography.body1())
                .onSubmit {
                    viewModel.applyFilters()
                }
                .onChange(of: viewModel.searchQuery) { _ in
                    viewModel.applyFilters()
                }
            }
            .padding(ThemeManager.shared.spacing.md)
            .background(AppColors.backgroundPaper)
            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            .overlay(
                RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                    .stroke(AppColors.borderDefault, lineWidth: 1)
            )
            
            // Restaurant Filter and Add Button
            HStack(spacing: ThemeManager.shared.spacing.md) {
                // Restaurant Filter
                Picker("Restoran", selection: $viewModel.selectedRestaurantId) {
                    Text("Tüm Restoranlar").tag("")
                    ForEach(viewModel.restaurants) { restaurant in
                        Text(restaurant.name).tag(restaurant.id)
                    }
                }
                .pickerStyle(.menu)
                .onChange(of: viewModel.selectedRestaurantId) { _ in
                    Task {
                        await viewModel.loadData()
                    }
                }
                
                Spacer()
                
                // Add Button
                Button(action: {
                    viewModel.openCreateForm()
                }) {
                    HStack {
                        Image(systemName: "plus")
                        Text("Yeni Menü Ekle")
                    }
                    .font(AppTypography.button())
                    .foregroundColor(.white)
                    .padding(.horizontal, ThemeManager.shared.spacing.lg)
                    .padding(.vertical, ThemeManager.shared.spacing.md)
                    .background(AppColors.primaryMain)
                    .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                }
            }
        }
        .padding(ThemeManager.shared.spacing.md)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}



