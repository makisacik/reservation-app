//
//  ReservationCardView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationCardView: View {
    let reservation: Reservation
    let mealName: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
            // Status Badge
            if let status = ReservationStatus(rawValue: reservation.status) {
                HStack {
                    Spacer()
                    StatusBadge(status: status)
                }
            }
            
            // Meal Name
            Text(mealName)
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.primaryMain)
            
            // Restaurant Name
            Text(reservation.restaurantName)
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textTertiary)
            
            // Date
            InfoRow(
                icon: "calendar",
                text: formatDate(reservation.date)
            )
            
            // Time Slot
            InfoRow(
                icon: "clock.fill",
                text: formatTimeSlot(reservation)
            )
            
            // Location
            InfoRow(
                icon: "location.fill",
                text: reservation.restaurantName
            )
        }
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
    
    private func formatDate(_ dateString: String) -> String {
        // Format as "4 Kasım 2025"
        // Parse ISO date and format in Turkish
        // TODO: Implement proper Turkish date formatting
        if let date = ISO8601DateFormatter().date(from: dateString) {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "tr_TR")
            formatter.dateFormat = "d MMMM yyyy"
            return formatter.string(from: date)
        }
        return dateString // Fallback
    }
    
    private func formatTimeSlot(_ reservation: Reservation) -> String {
        return "\(reservation.mealTimeSlotName)"
    }
}

struct StatusBadge: View {
    let status: ReservationStatus
    
    var body: some View {
        Text(status.displayName)
            .font(AppTypography.caption())
            .fontWeight(.medium)
            .foregroundColor(.white)
            .padding(.horizontal, ThemeManager.shared.spacing.sm)
            .padding(.vertical, ThemeManager.shared.spacing.xs)
            .background(status.color)
            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
    }
}

struct InfoRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: ThemeManager.shared.spacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(AppColors.textSecondary)
            
            Text(text)
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textPrimary)
        }
    }
}



