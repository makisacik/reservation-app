//
//  ReservationSummaryCardsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationSummaryCardsView: View {
    let summary: ReservationSummary?
    let isLoading: Bool
    
    var body: some View {
        LazyVGrid(columns: [
            GridItem(.flexible(), spacing: ThemeManager.shared.spacing.md),
            GridItem(.flexible(), spacing: ThemeManager.shared.spacing.md)
        ], spacing: ThemeManager.shared.spacing.md) {
            SummaryCard(
                title: "Bugün",
                value: summary?.todayCount ?? 0,
                isLoading: isLoading
            )
            
            SummaryCard(
                title: "Bu Hafta",
                value: summary?.thisWeekCount ?? 0,
                isLoading: isLoading
            )
            
            SummaryCard(
                title: "Bu Ay",
                value: summary?.thisMonthCount ?? 0,
                isLoading: isLoading,
                color: AppColors.successMain
            )
            
            SummaryCard(
                title: "Beklemede",
                value: summary?.pendingCount ?? 0,
                isLoading: isLoading,
                color: AppColors.warningMain
            )
        }
    }
}

struct SummaryCard: View {
    let title: String
    let value: Int
    let isLoading: Bool
    var color: Color = AppColors.primaryMain
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
            Text(title)
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
            
            if isLoading {
                ProgressView()
                    .frame(height: 32)
            } else {
                Text("\(value)")
                    .font(AppTypography.h4())
                    .fontWeight(.semibold)
                    .foregroundColor(color)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

