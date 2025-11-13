//
//  StatsGridView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct StatsGridView: View {
    let stats: HomePageStats?
    
    var body: some View {
        LazyVGrid(columns: [
            GridItem(.flexible(), spacing: AppSpacing.md),
            GridItem(.flexible(), spacing: AppSpacing.md)
        ], spacing: AppSpacing.md) {
            StatCardView(
                title: "Toplam Yemek",
                value: formatValue(stats?.totalMeals ?? 0),
                icon: "chart.line.uptrend.xyaxis",
                color: AppColors.successMain
            )
            
            StatCardView(
                title: "En Popüler",
                value: stats?.mostPopular ?? "N/A",
                icon: "person.3.fill",
                color: AppColors.primaryLight
            )
            
            StatCardView(
                title: "Tercih Oranı",
                value: formatPercentage(stats?.preferenceRate ?? 0),
                icon: "heart.fill",
                color: AppColors.errorMain
            )
            
            StatCardView(
                title: "Aperatif",
                value: formatValue(stats?.aperatifCount ?? 0),
                icon: "calendar",
                color: AppColors.warningMain
            )
        }
    }
    
    private func formatValue(_ value: Int) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.locale = Locale(identifier: "tr_TR")
        return formatter.string(from: NSNumber(value: value)) ?? "\(value)"
    }
    
    private func formatPercentage(_ value: Int) -> String {
        return "\(value)%"
    }
}

