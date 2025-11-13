//
//  AlertBannerView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AlertBannerView: View {
    let title: String
    let message: String
    
    var body: some View {
        HStack(alignment: .top, spacing: AppSpacing.sm) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 20))
                .foregroundColor(AppColors.textPrimary)
            
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(title)
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textPrimary)
                    .bold()
                
                Text(message)
                    .font(AppTypography.caption())
                    .foregroundColor(AppColors.textPrimary.opacity(0.9))
            }
        }
        .padding(ThemeManager.shared.spacing.md)
        .background(AppColors.warningMain)
        .foregroundColor(AppColors.textPrimary)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
    }
}

