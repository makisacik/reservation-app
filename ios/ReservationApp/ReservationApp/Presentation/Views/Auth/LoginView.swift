//
//  LoginView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()
    @StateObject private var authState = AuthStateManager.shared
    
    var body: some View {
        ZStack {
            // Gradient background
            LinearGradient(
                colors: [
                    Color(hex: "#f5f7fa"),
                    Color(hex: "#e6ecf5")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: AppSpacing.lg) {
                    Spacer()
                        .frame(height: 100)
                    
                    // Card container
                    VStack(spacing: AppSpacing.lg) {
                        // App Icon
                        ZStack {
                            RoundedRectangle(cornerRadius: ThemeManager.BorderRadius.button.value)
                                .fill(
                                    LinearGradient(
                                        colors: [
                                            AppColors.gradientLoginIconStart,
                                            AppColors.gradientLoginIconMiddle,
                                            AppColors.gradientLoginIconEnd
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 60, height: 60)
                                .appShadow(AppShadows.icon)
                            
                            Image(systemName: "fork.knife")
                                .font(.system(size: 32))
                                .foregroundColor(.white)
                        }
                        
                        // Title
                        Text("Yemek Rezervasyon Sistemi")
                            .font(AppTypography.h6())
                            .foregroundColor(AppColors.primaryMain)
                        
                        // Subtitle
                        Text("Lütfen giriş yapmak için bilgilerinizi girin")
                            .font(AppTypography.body2())
                            .foregroundColor(AppColors.textSecondary)
                            .multilineTextAlignment(.center)
                        
                        // Role Picker
                        Picker("Role", selection: $viewModel.selectedRole) {
                            ForEach(LoginRole.allCases, id: \.self) { role in
                                Text(role.rawValue).tag(role)
                            }
                        }
                        .pickerStyle(.menu)
                        .padding(.vertical, AppSpacing.sm)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        // Error Alert
                        if let errorMessage = viewModel.errorMessage {
                            HStack {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundColor(AppColors.errorMain)
                                Text(errorMessage)
                                    .font(AppTypography.body2())
                                    .foregroundColor(AppColors.errorMain)
                            }
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(AppColors.backgroundErrorLight)
                            .cornerRadius(ThemeManager.BorderRadius.medium.value)
                        }
                        
                        // Form
                        VStack(spacing: AppSpacing.md) {
                            CustomTextField(
                                placeholder: "ornek@sirket.com",
                                text: $viewModel.email,
                                keyboardType: .emailAddress
                            )
                            
                            CustomTextField(
                                placeholder: "Şifre",
                                text: $viewModel.password,
                                isSecure: true
                            )
                        }
                        
                        // Login Button
                        PrimaryButton(
                            title: viewModel.selectedRole == .admin ? "Admin Girişi" : "Personel Girişi",
                            action: {
                                Task {
                                    await viewModel.login()
                                }
                            },
                            isLoading: viewModel.isLoading,
                            isDisabled: viewModel.email.isEmpty || viewModel.password.isEmpty
                        )
                    }
                    .padding(AppSpacing.xl)
                    .background(AppColors.backgroundPaper)
                    .cornerRadius(ThemeManager.BorderRadius.large.value)
                    .appShadow(AppShadows.card)
                    .padding(.horizontal, AppSpacing.lg)
                    
                    Spacer()
                        .frame(height: 100)
                }
            }
        }
        .onAppear {
            // Set callback for successful login
            viewModel.onLoginSuccess = { user in
                authState.setAuthenticated(true)
            }
        }
    }
}

#Preview {
    NavigationStack {
        LoginView()
    }
}

