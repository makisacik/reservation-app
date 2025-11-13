//
//  ProfileView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()
    @State private var showErrorAlert = false
    @State private var showSuccessAlert = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: ThemeManager.shared.spacing.lg) {
                // Profile Card
                ProfileCardView(user: viewModel.user)
                
                // Form
                ProfileFormView(
                    name: $viewModel.name,
                    email: $viewModel.email,
                    department: $viewModel.department
                )
                
                // Action Buttons
                HStack(spacing: ThemeManager.shared.spacing.md) {
                    Button("İptal") {
                        // Reset form
                        Task {
                            await viewModel.loadProfile()
                        }
                    }
                    .buttonStyle(SecondaryButtonStyle())
                    
                    Button("Kaydet") {
                        Task {
                            await viewModel.saveProfile()
                        }
                    }
                    .buttonStyle(PrimaryButtonStyle())
                    .disabled(viewModel.isSaving)
                }
                .padding(.horizontal, ThemeManager.shared.spacing.lg)
            }
            .padding(ThemeManager.shared.spacing.md)
        }
        .background(AppColors.backgroundPage)
        .task {
            await viewModel.loadProfile()
        }
        .onChange(of: viewModel.errorMessage) { _, newValue in
            showErrorAlert = newValue != nil
        }
        .onChange(of: viewModel.successMessage) { _, newValue in
            showSuccessAlert = newValue != nil
        }
        .alert("Hata", isPresented: $showErrorAlert) {
            Button("Tamam") {
                viewModel.errorMessage = nil
            }
        } message: {
            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
            }
        }
        .alert("Başarılı", isPresented: $showSuccessAlert) {
            Button("Tamam") {
                viewModel.successMessage = nil
            }
        } message: {
            if let successMessage = viewModel.successMessage {
                Text(successMessage)
            }
        }
    }
}

// Button Styles
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(AppTypography.button())
            .fontWeight(.semibold)
            .foregroundColor(.white)
            .padding(.horizontal, ThemeManager.shared.spacing.lg)
            .padding(.vertical, ThemeManager.shared.spacing.md)
            .background(AppColors.primaryMain)
            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(AppTypography.button())
            .foregroundColor(AppColors.textSecondary)
            .padding(.horizontal, ThemeManager.shared.spacing.lg)
            .padding(.vertical, ThemeManager.shared.spacing.md)
            .background(Color.clear)
            .overlay(
                RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                    .stroke(AppColors.borderDefault, lineWidth: 1)
            )
            .opacity(configuration.isPressed ? 0.8 : 1.0)
    }
}

