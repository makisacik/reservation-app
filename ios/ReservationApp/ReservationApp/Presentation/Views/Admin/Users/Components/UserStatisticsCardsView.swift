//
//  UserStatisticsCardsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct UserStatisticsCardsView: View {
    let statistics: UserStatistics?
    let isLoading: Bool
    
    var body: some View {
        LazyVGrid(columns: [
            GridItem(.flexible(), spacing: ThemeManager.shared.spacing.md),
            GridItem(.flexible(), spacing: ThemeManager.shared.spacing.md)
        ], spacing: ThemeManager.shared.spacing.md) {
            StatisticsCard(
                title: "Toplam Kullanıcı",
                value: statistics?.totalUsers ?? 0,
                isLoading: isLoading,
                color: AppColors.primaryMain
            )
            
            StatisticsCard(
                title: "Aktif",
                value: statistics?.activeUsers ?? 0,
                isLoading: isLoading,
                color: AppColors.successMain
            )
            
            StatisticsCard(
                title: "Pasif",
                value: statistics?.passiveUsers ?? 0,
                isLoading: isLoading,
                color: AppColors.primaryMain
            )
            
            StatisticsCard(
                title: "Bu Ay Yeni",
                value: statistics?.newThisMonth ?? 0,
                isLoading: isLoading,
                color: AppColors.primaryMain
            )
        }
    }
}

struct StatisticsCard: View {
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



