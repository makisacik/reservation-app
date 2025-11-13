//
//  UserRowView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct UserRowView: View {
    let user: User
    let onEdit: () -> Void
    let onDetail: () -> Void
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.sm) {
            HStack(alignment: .top, spacing: ThemeManager.shared.spacing.md) {
                // Avatar and Name
                HStack(spacing: ThemeManager.shared.spacing.sm) {
                    UserAvatarView(name: user.name, size: 40)
                    
                    VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                        Text(user.name)
                            .font(AppTypography.body1())
                            .fontWeight(.medium)
                            .foregroundColor(AppColors.textPrimary)
                        
                        HStack(spacing: ThemeManager.shared.spacing.xs) {
                            Image(systemName: "envelope")
                                .font(.system(size: 14))
                                .foregroundColor(AppColors.textTertiary)
                            
                            Text(user.email)
                                .font(AppTypography.body2())
                                .foregroundColor(AppColors.textSecondary)
                        }
                    }
                }
                
                Spacer()
                
                // Status Badge
                if let status = user.status {
                    StatusBadgeView(status: status)
                }
            }
            
            // Second row: Department, Reservations, Actions
            HStack(spacing: ThemeManager.shared.spacing.md) {
                // Department Badge
                if let department = user.department {
                    Text(department)
                        .font(AppTypography.caption())
                        .foregroundColor(AppColors.textSecondary)
                        .padding(.horizontal, ThemeManager.shared.spacing.sm)
                        .padding(.vertical, ThemeManager.shared.spacing.xs)
                        .background(AppColors.backgroundLighter)
                        .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                }
                
                // Total Reservations
                HStack(spacing: ThemeManager.shared.spacing.xs) {
                    Text("\(user.totalReservations ?? 0)")
                        .font(AppTypography.body2())
                        .fontWeight(.medium)
                        .foregroundColor(AppColors.textPrimary)
                    
                    Text("Rezervasyon")
                        .font(AppTypography.caption())
                        .foregroundColor(AppColors.textTertiary)
                }
                
                Spacer()
                
                // Actions
                HStack(spacing: ThemeManager.shared.spacing.sm) {
                    Button(action: onEdit) {
                        Text("Düzenle")
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.primaryMain)
                    }
                    
                    Button(action: onDetail) {
                        Text("Detay")
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.primaryMain)
                    }
                }
            }
        }
        .padding(ThemeManager.shared.spacing.md)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct StatusBadgeView: View {
    let status: UserStatus
    
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

extension UserStatus {
    var displayName: String {
        switch self {
        case .active:
            return "Aktif"
        case .passive:
            return "Pasif"
        }
    }
    
    var color: Color {
        switch self {
        case .active:
            return AppColors.successMain
        case .passive:
            return AppColors.textSecondary
        }
    }
}

