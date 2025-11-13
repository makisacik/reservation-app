//
//  Step3MenuTypeSelectionView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct Step3MenuTypeSelectionView: View {
    @ObservedObject var viewModel: MakeReservationViewModel
    
    private let menuTypes: [MenuType] = [.standard, .special]
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Menü Tipi Seçimi")
                    .font(AppTypography.h5())
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.textPrimary)
                
                Text("Standart menü veya özel menü seçebilirsiniz")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
            }
            
            // Menu Type Grid
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: ThemeManager.shared.spacing.lg),
                GridItem(.flexible(), spacing: ThemeManager.shared.spacing.lg)
            ], spacing: ThemeManager.shared.spacing.lg) {
                ForEach(menuTypes, id: \.rawValue) { menuType in
                    MenuTypeCard(
                        menuType: menuType,
                        isSelected: viewModel.selectedMenuType == menuType,
                        onSelect: {
                            viewModel.selectedMenuType = menuType
                        }
                    )
                }
            }
        }
    }
}

struct MenuTypeCard: View {
    let menuType: MenuType
    let isSelected: Bool
    let onSelect: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            VStack(spacing: 0) {
                // Icon Section
                ZStack {
                    menuType.color
                        .frame(height: 250)
                    
                    Image(systemName: "fork.knife")
                        .font(.system(size: 100))
                        .foregroundColor(.white)
                }
                
                // Name Section
                VStack {
                    Text(menuType.displayName)
                        .font(AppTypography.h6())
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .fixedSize(horizontal: false, vertical: true)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, ThemeManager.shared.spacing.lg)
                        .padding(.vertical, ThemeManager.shared.spacing.md)
                        .background(menuType.color)
                        .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                }
                .padding(ThemeManager.shared.spacing.xl)
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

