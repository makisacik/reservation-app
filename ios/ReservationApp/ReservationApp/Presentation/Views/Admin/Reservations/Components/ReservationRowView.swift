//
//  ReservationRowView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationRowView: View {
    let reservation: Reservation
    let onDetailTap: () -> Void
    let onApproveTap: (() -> Void)?
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                    // Reservation Number
                    Text(reservation.reservationNumber)
                        .font(AppTypography.body1())
                        .fontWeight(.medium)
                        .foregroundColor(AppColors.textPrimary)
                    
                    // User Name
                    Text(reservation.userName)
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textSecondary)
                    
                    // Date and Time Slot
                    HStack(spacing: ThemeManager.shared.spacing.sm) {
                        Label(formatDate(reservation.date), systemImage: "calendar")
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.textSecondary)
                        
                        Label(reservation.mealTimeSlotName, systemImage: "clock")
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.textSecondary)
                    }
                    
                    // Restaurant and Menu
                    Text("\(reservation.restaurantName) • \(reservation.menuName.isEmpty ? "Menü" : reservation.menuName)")
                        .font(AppTypography.caption())
                        .foregroundColor(AppColors.textTertiary)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: ThemeManager.shared.spacing.sm) {
                    // Status Badge
                    if let status = ReservationStatus(rawValue: reservation.status) {
                        StatusBadge(status: status)
                    } else {
                        // Handle numeric status or unknown status
                        StatusBadge(status: .pending)
                    }
                    
                    // Actions
                    HStack(spacing: ThemeManager.shared.spacing.sm) {
                        Button(action: onDetailTap) {
                            Text("Detay")
                                .font(AppTypography.caption())
                                .foregroundColor(AppColors.primaryMain)
                        }
                        
                        if isPending(reservation.status) {
                            if let onApprove = onApproveTap {
                                Button(action: onApprove) {
                                    Text("Onayla")
                                        .font(AppTypography.caption())
                                        .foregroundColor(.white)
                                        .padding(.horizontal, ThemeManager.shared.spacing.sm)
                                        .padding(.vertical, ThemeManager.shared.spacing.xs)
                                        .background(AppColors.infoMain)
                                        .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                                }
                            }
                        }
                    }
                }
            }
        }
        .padding(ThemeManager.shared.spacing.md)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
    
    private func formatDate(_ dateString: String) -> String {
        // Format as "4 Kasım 2025"
        if let date = ISO8601DateFormatter().date(from: dateString) {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "tr_TR")
            formatter.dateFormat = "d MMMM yyyy"
            return formatter.string(from: date)
        }
        return dateString // Fallback
    }
    
    private func isPending(_ status: String) -> Bool {
        return status.lowercased() == "pending" || status == "3"
    }
}



