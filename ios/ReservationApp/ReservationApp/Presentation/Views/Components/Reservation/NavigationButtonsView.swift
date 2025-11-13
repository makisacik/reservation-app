//
//  NavigationButtonsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct NavigationButtonsView: View {
    @ObservedObject var viewModel: MakeReservationViewModel
    
    var body: some View {
        HStack(spacing: ThemeManager.shared.spacing.md) {
            // Back Button
            if viewModel.currentStep > 1 {
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        viewModel.previousStep()
                    }
                }) {
                    Text("Geri")
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
            }
            
            // Next Button
            Button(action: {
                withAnimation(.easeInOut(duration: 0.2)) {
                    viewModel.nextStep()
                }
            }) {
                Text("İleri")
                    .font(AppTypography.button())
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ThemeManager.shared.spacing.md)
                    .background(viewModel.canProceedToNextStep() ? AppColors.primaryMain : AppColors.borderDefault)
                    .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            }
            .disabled(!viewModel.canProceedToNextStep())
        }
    }
}

