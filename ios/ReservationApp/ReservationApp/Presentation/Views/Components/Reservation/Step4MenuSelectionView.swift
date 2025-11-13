//
//  Step4MenuSelectionView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct Step4MenuSelectionView: View {
    @ObservedObject var viewModel: MakeReservationViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Menü Seçimi")
                    .font(AppTypography.h5())
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.textPrimary)
                
                if let restaurant = viewModel.selectedRestaurant,
                   let menuType = viewModel.selectedMenuType {
                    Text("\(restaurant.name) - \(menuType.displayName)")
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textSecondary)
                }
            }
            
            // Multiple dates warning
            if viewModel.selectedDates.count > 1 {
                InfoBanner(
                    message: "Not: Seçilen menü tüm seçili tarihler için kullanılacaktır."
                )
            }
            
            // Loading State
            if viewModel.isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity)
                    .padding(ThemeManager.shared.spacing.xl)
            }
            // Error State
            else if let error = viewModel.errorMessage {
                ErrorView(message: error)
            }
            // Empty State
            else if viewModel.availableMenus.isEmpty {
                EmptyMenusView()
            }
            // Meals List
            else {
                let meals = viewModel.availableMenus.first?.meals ?? []
                
                VStack(spacing: ThemeManager.shared.spacing.md) {
                    ForEach(meals) { meal in
                        MealSelectionCard(
                            meal: meal,
                            isSelected: viewModel.selectedMeal?.id == meal.id,
                            onSelect: {
                                viewModel.selectedMenu = viewModel.availableMenus.first
                                viewModel.selectedMeal = meal
                            }
                        )
                    }
                }
                
                // Appetizer Checkbox
                AppetizerCheckbox(
                    isChecked: $viewModel.appetizer
                )
            }
        }
        .task {
            if viewModel.currentStep == 4 {
                await viewModel.loadMenus()
            }
        }
    }
}

struct MealSelectionCard: View {
    let meal: Meal
    let isSelected: Bool
    let onSelect: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            VStack(alignment: .leading, spacing: 0) {
                // Image
                ZStack {
                    if let imageUrl = meal.imageUrl, let url = URL(string: imageUrl) {
                        CachedAsyncImage(url: url) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Color.gray.opacity(0.3)
                        }
                        .frame(height: 200)
                        .clipped()
                    } else {
                        Color.gray.opacity(0.3)
                            .frame(height: 200)
                    }
                }
                
                // Info
                VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.sm) {
                    Text(meal.name)
                        .font(AppTypography.h6())
                        .fontWeight(.semibold)
                        .foregroundColor(AppColors.textPrimary)
                        .lineLimit(2)
                    
                    Text(meal.description ?? "Açıklama yok")
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textSecondary)
                        .lineLimit(3)
                    
                    if isSelected {
                        Button("Seçildi") {}
                            .buttonStyle(SelectedButtonStyle())
                            .disabled(true)
                    }
                }
                .padding(ThemeManager.shared.spacing.md)
            }
            .frame(height: 350) // Fixed height
            .frame(maxWidth: .infinity)
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

struct AppetizerCheckbox: View {
    @Binding var isChecked: Bool
    
    var body: some View {
        HStack {
            Button(action: {
                isChecked.toggle()
            }) {
                Image(systemName: isChecked ? "checkmark.square.fill" : "square")
                    .foregroundColor(isChecked ? AppColors.primaryMain : AppColors.textSecondary)
                    .font(.system(size: 24))
            }
            
            Text("Aparetif talebi ekle (Mevsim meze tabağı)")
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textPrimary)
        }
        .padding()
        .background(AppColors.warningMain.opacity(0.1))
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
    }
}

struct InfoBanner: View {
    let message: String
    
    var body: some View {
        HStack {
            Image(systemName: "info.circle.fill")
                .foregroundColor(AppColors.infoMain)
            
            Text(message)
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textPrimary)
        }
        .padding()
        .background(AppColors.infoMain.opacity(0.1))
        .overlay(
            RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                .stroke(AppColors.infoMain, lineWidth: 1)
        )
        .cornerRadius(ThemeManager.shared.borderRadius.button.value)
    }
}

struct ErrorView: View {
    let message: String
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.sm) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(AppColors.errorMain)
                .font(.system(size: 48))
            
            Text(message)
                .font(AppTypography.body1())
                .foregroundColor(AppColors.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.xl)
    }
}

struct EmptyMenusView: View {
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.sm) {
            Image(systemName: "fork.knife")
                .foregroundColor(AppColors.textTertiary)
                .font(.system(size: 48))
            
            Text("Bu tarih ve menü tipi için menü bulunamadı.")
                .font(AppTypography.body1())
                .foregroundColor(AppColors.textSecondary)
            
            Text("Lütfen farklı bir menü tipi seçin veya başka bir tarih deneyin.")
                .font(AppTypography.caption())
                .foregroundColor(AppColors.textTertiary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.xl)
    }
}

struct SelectedButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(AppTypography.body2())
            .fontWeight(.medium)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, ThemeManager.shared.spacing.sm)
            .background(AppColors.primaryMain)
            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
    }
}

