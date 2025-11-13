//
//  ReservationsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationsView: View {
    var body: some View {
        NavigationStack {
            VStack {
                Text("Rezervasyonlarım")
                    .font(AppTypography.h4())
                    .foregroundColor(AppColors.textPrimary)
                
                Text("Yakında eklenecek...")
                    .font(AppTypography.body1())
                    .foregroundColor(AppColors.textSecondary)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(AppColors.backgroundPage)
        }
    }
}

