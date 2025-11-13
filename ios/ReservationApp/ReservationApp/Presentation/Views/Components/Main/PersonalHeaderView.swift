//
//  PersonalHeaderView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct PersonalHeaderView: View {
    let user: User?
    
    var body: some View {
        HStack {
            UserInfoView(user: user)
            Spacer()
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

