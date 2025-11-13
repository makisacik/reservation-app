//
//  MealGridView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct MealGridView: View {
    let meals: [Meal]
    let isLoading: Bool
    let maxItems: Int?
    let onMealTap: ((Meal) -> Void)?
    
    var body: some View {
        if isLoading {
            ProgressView()
                .frame(maxWidth: .infinity)
                .padding(ThemeManager.shared.spacing.xl)
        } else if meals.isEmpty {
            EmptyMealsView()
        } else {
            let displayMeals = maxItems.map { Array(meals.prefix($0)) } ?? meals
            
            LazyVStack(spacing: ThemeManager.shared.spacing.md) {
                ForEach(displayMeals) { meal in
                    MealCardView(meal: meal) {
                        onMealTap?(meal)
                    }
                }
            }
        }
    }
}

struct EmptyMealsView: View {
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.sm) {
            Image(systemName: "fork.knife")
                .font(.system(size: 48))
                .foregroundColor(AppColors.textTertiary)
            
            Text("Henüz yemek bulunmamaktadır.")
                .font(AppTypography.body1())
                .foregroundColor(AppColors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.xl)
    }
}

