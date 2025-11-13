//
//  AdminMealCardView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AdminMealCardView: View {
    let meal: Meal
    let onEdit: () -> Void
    let onDelete: () -> Void
    
    var body: some View {
        VStack(spacing: 0) {
            // Image Section
            ZStack(alignment: .topTrailing) {
                // Meal Image
                CachedAsyncImage(url: URL(string: meal.imageUrl ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    LinearGradient(
                        colors: [AppColors.primaryLight.opacity(0.3), AppColors.primaryMain.opacity(0.3)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                }
                .frame(height: 200)
                .frame(maxWidth: .infinity)
                .clipped()
                
                // Category Badge
                CategoryBadge(name: meal.categoryName)
                    .padding(ThemeManager.shared.spacing.sm)
            }
            
            // Content Section
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.sm) {
                // Name and Price Row
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                        Text(meal.name)
                            .font(AppTypography.h6())
                            .fontWeight(.semibold)
                            .foregroundColor(AppColors.textPrimary)
                            .lineLimit(2)
                        
                        Text(meal.restaurantName)
                            .font(AppTypography.body2())
                            .foregroundColor(AppColors.textSecondary)
                    }
                    
                    Spacer()
                    
                    if let price = meal.price {
                        Text(formatPrice(price))
                            .font(AppTypography.h6())
                            .fontWeight(.semibold)
                            .foregroundColor(AppColors.textPrimary)
                    }
                }
                
                // Action Buttons
                HStack(spacing: ThemeManager.shared.spacing.sm) {
                    Button(action: onEdit) {
                        HStack {
                            Image(systemName: "pencil")
                            Text("Düzenle")
                        }
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textPrimary)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, ThemeManager.shared.spacing.sm)
                        .background(Color.clear)
                        .overlay(
                            RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                                .stroke(AppColors.borderDefault, lineWidth: 1)
                        )
                        .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                    }
                    
                    Button(action: onDelete) {
                        Image(systemName: "trash")
                            .foregroundColor(.white)
                            .frame(width: 48, height: 48)
                            .background(AppColors.errorMain)
                            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                    }
                }
            }
            .padding(ThemeManager.shared.spacing.md)
        }
        .frame(maxWidth: .infinity)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
    
    private func formatPrice(_ price: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return "\(formatter.string(from: NSNumber(value: price)) ?? "\(price)")₺"
    }
}

