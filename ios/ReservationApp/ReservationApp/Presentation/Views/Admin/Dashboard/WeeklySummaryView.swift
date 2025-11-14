//
//  WeeklySummaryView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct WeeklySummaryView: View {
    let dailyData: [DailySummary]
    let isLoading: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
            Text("Haftalık Rezervasyon Özeti")
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textPrimary)
            
            if isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity)
                    .padding(ThemeManager.shared.spacing.xl)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: ThemeManager.shared.spacing.md) {
                        ForEach(dailyData) { day in
                            DailySummaryCard(day: day)
                        }
                    }
                }
            }
        }
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct DailySummaryCard: View {
    let day: DailySummary
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.xs) {
            Text(day.dayAbbreviation)
                .font(AppTypography.body2())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textSecondary)
            
            Text("\(day.reservationCount)")
                .font(AppTypography.h5())
                .fontWeight(.bold)
                .foregroundColor(AppColors.textPrimary)
            
            Text("Rezervasyon")
                .font(AppTypography.caption())
                .foregroundColor(AppColors.textTertiary)
        }
        .frame(width: 100)
        .padding(ThemeManager.shared.spacing.md)
        .background(AppColors.backgroundInactiveTab)
        .cornerRadius(ThemeManager.shared.borderRadius.button.value)
        .overlay(
            RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                .stroke(AppColors.borderDefault, lineWidth: 1)
        )
    }
}



