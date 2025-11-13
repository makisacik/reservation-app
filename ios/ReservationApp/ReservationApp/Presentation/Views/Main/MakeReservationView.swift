//
//  MakeReservationView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI
import Combine

struct MakeReservationView: View {
    @StateObject private var viewModel = MakeReservationViewModel()
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        ScrollView {
            VStack(spacing: ThemeManager.shared.spacing.xl) {
                // Header
                VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                    Text("Rezervasyon Yap")
                        .font(AppTypography.h4())
                        .foregroundColor(AppColors.textPrimary)
                    
                    Text("Toyota çalışanları için haftalık yemek rezervasyonu")
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                // Stepper
                ReservationStepperView(currentStep: viewModel.currentStep)
                    .padding(.bottom, ThemeManager.shared.spacing.xl)
                
                // Step Content
                stepContent
                    .frame(minHeight: 400)
                    .id(viewModel.currentStep) // Prevent jumping on step change
                
                // Navigation Buttons (not on confirmation step)
                if viewModel.currentStep < 5 {
                    NavigationButtonsView(viewModel: viewModel)
                }
            }
            .padding(ThemeManager.shared.spacing.lg)
        }
        .background(AppColors.backgroundPage)
        .task {
            await viewModel.loadInitialData()
        }
        .alert("Hata", isPresented: .constant(viewModel.errorMessage != nil)) {
            Button("Tamam") {
                viewModel.errorMessage = nil
            }
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
        .alert("Başarılı", isPresented: .constant(viewModel.successMessage != nil)) {
            Button("Tamam") {
                viewModel.successMessage = nil
                dismiss()
            }
        } message: {
            Text(viewModel.successMessage ?? "")
        }
    }
    
    @ViewBuilder
    private var stepContent: some View {
        switch viewModel.currentStep {
        case 1:
            Step1DateSelectionView(viewModel: viewModel)
        case 2:
            Step2RestaurantSelectionView(viewModel: viewModel)
        case 3:
            Step3MenuTypeSelectionView(viewModel: viewModel)
        case 4:
            Step4MenuSelectionView(viewModel: viewModel)
        case 5:
            Step5ConfirmationView(viewModel: viewModel)
        default:
            EmptyView()
        }
    }
}
