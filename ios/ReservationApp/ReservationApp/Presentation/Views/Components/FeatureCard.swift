//
//  FeatureCard.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct FeatureCard: View {
    let icon: String
    let title: String
    let description: String
    let gradient: LinearGradient
    
    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            // Icon with gradient background
            ZStack {
                RoundedRectangle(cornerRadius: ThemeManager.BorderRadius.button.value)
                    .fill(gradient)
                    .frame(width: 56, height: 56)
                
                Image(systemName: icon)
                    .font(.system(size: 28))
                    .foregroundColor(.white)
            }
            
            // Title
            Text(title)
                .font(AppTypography.h5())
                .foregroundColor(AppColors.onboardingPrimary)
            
            // Description
            Text(description)
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.lg)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.BorderRadius.xlarge.value)
        .appShadow(AppShadows.onboardingCard)
    }
}

