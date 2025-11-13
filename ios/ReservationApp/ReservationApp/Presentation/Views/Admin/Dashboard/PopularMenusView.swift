//
//  PopularMenusView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct PopularMenusView: View {
    let meals: [PopularMeal]
    let isLoading: Bool
    
    private var maxCount: Int {
        meals.map { $0.reservationCount }.max() ?? 1
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
            Text("En Popüler Menüler")
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textPrimary)
            
            if isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity)
                    .padding(ThemeManager.shared.spacing.xl)
            } else if meals.isEmpty {
                Text("Henüz popüler menü bulunmamaktadır.")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
                    .frame(maxWidth: .infinity)
                    .padding(ThemeManager.shared.spacing.xl)
            } else {
                ForEach(meals) { meal in
                    PopularMealRow(meal: meal, maxCount: maxCount)
                }
            }
        }
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct PopularMealRow: View {
    let meal: PopularMeal
    let maxCount: Int
    
    private var progress: Double {
        Double(meal.reservationCount) / Double(maxCount)
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.sm) {
            HStack {
                Text(meal.mealName)
                    .font(AppTypography.body1())
                    .fontWeight(.medium)
                    .foregroundColor(AppColors.textPrimary)
                
                Spacer()
                
                Text("\(meal.reservationCount) sipariş")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
            }
            
            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(AppColors.borderDefault)
                        .frame(height: 8)
                        .cornerRadius(ThemeManager.shared.borderRadius.small.value)
                    
                    Rectangle()
                        .fill(AppColors.primaryLight)
                        .frame(width: geometry.size.width * progress, height: 8)
                        .cornerRadius(ThemeManager.shared.borderRadius.small.value)
                }
            }
            .frame(height: 8)
        }
    }
}

