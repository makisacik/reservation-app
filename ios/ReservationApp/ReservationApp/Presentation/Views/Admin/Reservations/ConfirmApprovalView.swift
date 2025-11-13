//
//  ConfirmApprovalView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ConfirmApprovalView: View {
    let reservation: Reservation?
    @Binding var isPresented: Bool
    let onConfirm: () -> Void
    let isLoading: Bool
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.lg) {
            // Icon
            ZStack {
                Circle()
                    .fill(AppColors.infoMain.opacity(0.1))
                    .frame(width: 80, height: 80)
                
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 48))
                    .foregroundColor(AppColors.infoMain)
            }
            
            // Title
            Text("Rezervasyonu Onaylamak İstiyor musunuz?")
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textPrimary)
                .multilineTextAlignment(.center)
            
            // Reservation Number
            if let reservation = reservation {
                VStack(spacing: ThemeManager.shared.spacing.xs) {
                    Text("Rezervasyon No")
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textSecondary)
                    
                    Text(reservation.reservationNumber)
                        .font(AppTypography.body1())
                        .fontWeight(.semibold)
                        .foregroundColor(AppColors.primaryMain)
                }
                .padding(ThemeManager.shared.spacing.md)
                .frame(maxWidth: .infinity)
                .background(AppColors.backgroundPage)
                .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            }
            
            // Message
            Text("Onaylandıktan sonra rezervasyon durumu \"Onaylandı\" olarak güncellenecektir.")
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
                .multilineTextAlignment(.center)
            
            // Actions
            HStack(spacing: ThemeManager.shared.spacing.md) {
                Button(action: {
                    isPresented = false
                }) {
                    Text("İptal")
                        .font(AppTypography.button())
                        .foregroundColor(AppColors.textSecondary)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, ThemeManager.shared.spacing.md)
                        .background(Color.clear)
                        .overlay(
                            RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                                .stroke(AppColors.borderDefault, lineWidth: 1)
                        )
                        .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                }
                .disabled(isLoading)
                
                Button(action: onConfirm) {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Image(systemName: "checkmark.circle.fill")
                        }
                        Text(isLoading ? "Onaylanıyor..." : "Onayla")
                            .font(AppTypography.button())
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ThemeManager.shared.spacing.md)
                    .background(AppColors.infoMain)
                    .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                }
                .disabled(isLoading)
            }
        }
        .padding(ThemeManager.shared.spacing.xl)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
    }
}

