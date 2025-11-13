//
//  PrimaryButton.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isLoading: Bool = false
    var isDisabled: Bool = false
    
    var body: some View {
        Button(action: action) {
            HStack {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.8)
                } else {
                    Text(title)
                        .font(AppTypography.button())
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(isDisabled ? AppColors.onboardingPrimary.opacity(0.6) : AppColors.onboardingPrimary)
            .foregroundColor(.white)
            .cornerRadius(ThemeManager.BorderRadius.button.value)
        }
        .disabled(isLoading || isDisabled)
    }
}

