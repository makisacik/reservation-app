//
//  Step2RestaurantSelectionView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct Step2RestaurantSelectionView: View {
    @ObservedObject var viewModel: MakeReservationViewModel
    
    private let restaurantColors: [Color] = [
        AppColors.successMain,
        AppColors.infoMain
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Restoran Seçimi")
                    .font(AppTypography.h5())
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.textPrimary)
                
                Text("Yemek yemek istediğiniz restoranı seçin")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
            }
            
            // Restaurant Grid
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: ThemeManager.shared.spacing.lg),
                GridItem(.flexible(), spacing: ThemeManager.shared.spacing.lg)
            ], spacing: ThemeManager.shared.spacing.lg) {
                ForEach(Array(viewModel.restaurants.enumerated()), id: \.element.id) { index, restaurant in
                    RestaurantCard(
                        restaurant: restaurant,
                        color: restaurantColors[index % restaurantColors.count],
                        isSelected: viewModel.selectedRestaurant?.id == restaurant.id,
                        onSelect: {
                            viewModel.selectedRestaurant = restaurant
                        }
                    )
                }
            }
        }
    }
}

struct RestaurantCard: View {
    let restaurant: Restaurant
    let color: Color
    let isSelected: Bool
    let onSelect: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            VStack(spacing: 0) {
                // Icon Section
                ZStack {
                    color
                        .frame(height: 200)
                    
                    Image(systemName: "fork.knife")
                        .font(.system(size: 80))
                        .foregroundColor(.white)
                }
                
                // Name Section
                VStack(spacing: ThemeManager.shared.spacing.md) {
                    Text(restaurant.name)
                        .font(AppTypography.h6())
                        .fontWeight(.semibold)
                        .foregroundColor(AppColors.textPrimary)
                        .padding(.top, ThemeManager.shared.spacing.lg)
                    
                    if isSelected {
                        Text("Seçildi")
                            .font(AppTypography.body2())
                            .fontWeight(.medium)
                            .foregroundColor(.white)
                            .padding(.horizontal, ThemeManager.shared.spacing.lg)
                            .padding(.vertical, ThemeManager.shared.spacing.sm)
                            .background(AppColors.primaryMain)
                            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                    }
                }
                .padding(.bottom, ThemeManager.shared.spacing.lg)
            }
            .background(AppColors.backgroundPaper)
            .cornerRadius(ThemeManager.shared.borderRadius.card.value)
            .overlay(
                RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.card.value)
                    .stroke(isSelected ? AppColors.primaryMain : Color.clear, lineWidth: 3)
            )
            .shadow(color: Color.black.opacity(0.05), radius: isSelected ? 8 : 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

