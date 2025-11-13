//
//  MenuCategoryTabsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct MenuCategoryTabsView: View {
    @Binding var selectedTab: CategoryTab
    let onTabSelected: (CategoryTab) -> Void
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: ThemeManager.shared.spacing.sm) {
                ForEach(CategoryTab.allCases, id: \.self) { tab in
                    MenuCategoryTabButton(
                        title: tab.displayName,
                        isSelected: selectedTab == tab,
                        action: {
                            selectedTab = tab
                            onTabSelected(tab)
                        }
                    )
                }
            }
            .padding(.horizontal, ThemeManager.shared.spacing.md)
        }
    }
}

struct MenuCategoryTabButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(AppTypography.body1())
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundColor(isSelected ? AppColors.primaryMain : AppColors.textSecondary)
                .padding(.horizontal, ThemeManager.shared.spacing.lg)
                .padding(.vertical, ThemeManager.shared.spacing.md)
                .background(isSelected ? AppColors.backgroundActiveTab : Color.clear)
                .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                .overlay(
                    RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                        .stroke(isSelected ? Color.clear : AppColors.borderDefault, lineWidth: 1)
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

