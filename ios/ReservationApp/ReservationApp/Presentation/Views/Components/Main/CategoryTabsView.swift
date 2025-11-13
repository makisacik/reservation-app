//
//  CategoryTabsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct CategoryTabsView: View {
    let categories: [MenuCategory]
    let selectedCategory: String
    let onCategorySelected: (String) -> Void
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: ThemeManager.shared.spacing.md) {
                ForEach(categories) { category in
                    CategoryTabButton(
                        title: category.name,
                        isSelected: selectedCategory == category.name,
                        action: {
                            onCategorySelected(category.name)
                        }
                    )
                }
            }
            .padding(.horizontal, ThemeManager.shared.spacing.md)
        }
    }
}

struct CategoryTabButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(AppTypography.body1())
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundColor(isSelected ? .white : AppColors.textSecondary)
                .padding(.horizontal, ThemeManager.shared.spacing.lg)
                .padding(.vertical, ThemeManager.shared.spacing.md)
                .background(
                    isSelected 
                        ? AppColors.primaryMain
                        : AppColors.backgroundInactiveTab
                )
                .cornerRadius(ThemeManager.shared.borderRadius.pill.value)
                .overlay(
                    RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.pill.value)
                        .stroke(
                            isSelected 
                                ? Color.clear
                                : AppColors.borderDefault,
                            lineWidth: 1
                        )
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

