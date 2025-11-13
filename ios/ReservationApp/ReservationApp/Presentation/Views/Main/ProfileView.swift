//
//  ProfileView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ProfileView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ThemeManager.shared.spacing.lg) {
                    Text("Profilim")
                        .font(AppTypography.h4())
                        .foregroundColor(AppColors.textPrimary)
                    
                    Text("Yakında eklenecek...")
                        .font(AppTypography.body1())
                        .foregroundColor(AppColors.textSecondary)
                }
                .padding(ThemeManager.shared.spacing.lg)
            }
            .background(AppColors.backgroundPage)
        }
    }
}

