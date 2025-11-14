//
//  AdminDashboardView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AdminDashboardView: View {
    @StateObject private var viewModel = AdminDashboardViewModel()
    
    var body: some View {
        ScrollView {
            VStack(spacing: ThemeManager.shared.spacing.lg) {
                VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                    Text("Panel")
                        .font(AppTypography.h4())
                        .foregroundColor(AppColors.textPrimary)
                    
                    Text("Yemek rezervasyon sistemi genel bakış")
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                if let summary = viewModel.summary {
                    DashboardStatsGridView(summary: summary)
                }
                
                VStack(spacing: ThemeManager.shared.spacing.md) {
                    TodayReservationsView(
                        reservations: viewModel.todayReservations,
                        isLoading: viewModel.isLoading
                    )
                    
                    PopularMenusView(
                        meals: viewModel.popularMeals,
                        isLoading: viewModel.isLoading
                    )
                }
                
                WeeklySummaryView(
                    dailyData: viewModel.dailySummary,
                    isLoading: viewModel.isLoading
                )
            }
            .padding(ThemeManager.shared.spacing.md)
        }
        .background(AppColors.backgroundPage)
        .refreshable {
            await viewModel.refresh()
        }
        .task {
            await viewModel.loadDashboardData()
        }
    }
}

struct DashboardStatsGridView: View {
    let summary: DashboardSummary
    
    var body: some View {
        LazyVGrid(columns: [
            GridItem(.flexible(), spacing: ThemeManager.shared.spacing.md),
            GridItem(.flexible(), spacing: ThemeManager.shared.spacing.md)
        ], spacing: ThemeManager.shared.spacing.md) {
            StatCardView(
                title: "Toplam Rezervasyon",
                value: "\(summary.totalReservations)",
                icon: "calendar",
                color: AppColors.primaryLight
            )
            
            StatCardView(
                title: "Aktif Kullanıcı",
                value: "\(summary.activeUsers)",
                icon: "person.3.fill",
                color: AppColors.primaryLight
            )
            
            StatCardView(
                title: "Bugünkü Yemek",
                value: "\(summary.todayMeals)",
                icon: "fork.knife",
                color: AppColors.primaryLight
            )
            
            StatCardView(
                title: "Aylık Maliyet",
                value: formatCurrency(summary.monthlyCost),
                icon: "dollarsign.circle.fill",
                color: AppColors.primaryLight
            )
        }
    }
    
    private func formatCurrency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = Locale(identifier: "tr_TR")
        return formatter.string(from: NSNumber(value: value)) ?? "₺\(Int(value))"
    }
}

