//
//  TodayReservationsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct TodayReservationsView: View {
    let reservations: [TodayReservationGroup]
    let isLoading: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
            Text("Bugünkü Rezervasyonlar")
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textPrimary)
            
            if isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity)
                    .padding(ThemeManager.shared.spacing.xl)
            } else if reservations.isEmpty {
                Text("Bugün için rezervasyon bulunmamaktadır.")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
                    .frame(maxWidth: .infinity)
                    .padding(ThemeManager.shared.spacing.xl)
            } else {
                ForEach(reservations) { reservation in
                    TodayReservationRow(reservation: reservation)
                }
            }
        }
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct TodayReservationRow: View {
    let reservation: TodayReservationGroup
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text(getTurkishName(reservation.mealTimeSlotName))
                    .font(AppTypography.body1())
                    .fontWeight(.medium)
                    .foregroundColor(AppColors.textPrimary)
                
                Text("\(formatTimeRange(reservation.startTime, reservation.endTime)) • \(reservation.restaurantName)")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
            }
            
            Spacer()
            
            Text("\(reservation.reservationCount)")
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.primaryLight)
        }
        .padding(.vertical, ThemeManager.shared.spacing.sm)
    }
    
    private func getTurkishName(_ englishName: String) -> String {
        switch englishName.lowercased() {
        case "breakfast":
            return "Kahvaltı"
        case "lunch":
            return "Öğle Yemeği"
        case "dinner":
            return "Akşam Yemeği"
        default:
            return englishName
        }
    }
    
    private func formatTimeRange(_ start: String, _ end: String) -> String {
        // Format time range - assuming times are in HH:mm format
        // If backend returns full ISO strings, we'll need to parse them
        if start.contains("T") {
            // ISO format - extract time part
            let startTime = String(start.split(separator: "T").last?.prefix(5) ?? "")
            let endTime = String(end.split(separator: "T").last?.prefix(5) ?? "")
            return "\(startTime)-\(endTime)"
        } else {
            return "\(start)-\(end)"
        }
    }
}



