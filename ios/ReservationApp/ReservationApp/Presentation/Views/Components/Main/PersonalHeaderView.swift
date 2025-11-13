//
//  PersonalHeaderView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AlertMessage {
    let title: String
    let message: String
}

struct PersonalHeaderView: View {
    let user: User?
    let alertMessage: AlertMessage?
    
    var body: some View {
        VStack(spacing: AppSpacing.md) {
            HStack {
                UserInfoView(user: user)
                
                Spacer()
                
                if let alert = alertMessage {
                    AlertBannerView(
                        title: alert.title,
                        message: alert.message
                    )
                    .frame(maxWidth: 200)
                }
            }
        }
        .padding(ThemeManager.shared.spacing.lg)
        .background(
            LinearGradient(
                colors: [AppColors.primaryLight, AppColors.primaryMain],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .foregroundColor(.white)
    }
}

