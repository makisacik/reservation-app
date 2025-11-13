//
//  ReservationButtonView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationButtonView: View {
    let label: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .font(AppTypography.button())
                .fontWeight(.semibold)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, ThemeManager.shared.spacing.md)
                .background(AppColors.primaryMain)
                .cornerRadius(ThemeManager.shared.borderRadius.button.value)
        }
        .padding(.top, ThemeManager.shared.spacing.lg)
    }
}

