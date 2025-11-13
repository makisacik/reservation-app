//
//  MenuSectionView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct MenuSectionView: View {
    let categories: [MenuCategory]
    let selectedCategory: String
    let meals: [Meal]
    let isLoading: Bool
    let onCategorySelected: (String) -> Void
    let onReservationTap: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Bugünün Menüsü")
                    .font(AppTypography.h6())
                    .fontWeight(.bold)
                    .foregroundColor(AppColors.textPrimary)
                
                Text("Restoran rezervasyonu ve yemekhane menüsü")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
            }
            
            // Category tabs
            CategoryTabsView(
                categories: categories,
                selectedCategory: selectedCategory,
                onCategorySelected: onCategorySelected
            )
            
            // Meal grid
            MealGridView(
                meals: meals,
                isLoading: isLoading,
                maxItems: 4,
                onMealTap: { meal in
                    // Optional: Show meal detail or navigate
                }
            )
            
            // Reservation button
            ReservationButtonView(
                label: "Rezervasyon Yap",
                action: onReservationTap
            )
        }
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

