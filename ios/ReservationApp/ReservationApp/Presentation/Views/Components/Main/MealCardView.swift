//
//  MealCardView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct MealCardView: View {
    let meal: Meal
    let onTap: (() -> Void)?
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image section
            ZStack(alignment: .topTrailing) {
                // Meal image or placeholder
                CachedAsyncImage(url: URL(string: meal.imageUrl ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    // Placeholder gradient
                    LinearGradient(
                        colors: [AppColors.primaryLight.opacity(0.3), AppColors.primaryMain.opacity(0.3)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                }
                .frame(height: 150)
                .frame(maxWidth: .infinity)
                .clipped()
                
                // Category badge
                CategoryBadge(name: meal.categoryName)
                    .padding(ThemeManager.shared.spacing.sm)
            }
            .frame(height: 150)
            
            // Content section
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text(meal.name)
                    .font(AppTypography.h6())
                    .fontWeight(.bold)
                    .foregroundColor(AppColors.textPrimary)
                    .lineLimit(2)
                
                if let kcal = meal.kcal {
                    Text("\(kcal) kcal")
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textSecondary)
                }
            }
            .padding(ThemeManager.shared.spacing.md)
        }
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
        .onTapGesture {
            onTap?()
        }
    }
}

struct CategoryBadge: View {
    let name: String
    
    var body: some View {
        Text(name)
            .font(AppTypography.caption())
            .fontWeight(.semibold)
            .foregroundColor(.white)
            .padding(.horizontal, ThemeManager.shared.spacing.sm)
            .padding(.vertical, ThemeManager.shared.spacing.xs)
            .background(AppColors.primaryLight)
            .cornerRadius(ThemeManager.shared.borderRadius.medium.value)
    }
}

