//
//  OnboardingView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct OnboardingView: View {
    @StateObject private var viewModel = OnboardingViewModel()
    @State private var navigateToLogin = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Gradient background
                LinearGradient(
                    colors: [
                        Color(hex: "#E8F4F8"),
                        Color(hex: "#F5F9FC"),
                        Color.white
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: AppSpacing.xl) {
                        // Logo
                        ZStack {
                            RoundedRectangle(cornerRadius: ThemeManager.BorderRadius.button.value)
                                .fill(AppColors.onboardingPrimary)
                                .frame(width: 80, height: 80)
                            
                            Text("ISS")
                                .font(.system(size: 32, weight: .bold))
                                .foregroundColor(.white)
                                .kerning(1)
                        }
                        .padding(.top, AppSpacing.xl2)
                        
                        // Main Title
                        Text("ISS Yemek Rezervasyon Sistemi")
                            .font(.system(size: 44, weight: .bold))
                            .foregroundColor(AppColors.onboardingPrimary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, AppSpacing.md)
                        
                        // Description
                        VStack(spacing: AppSpacing.xs) {
                            Text("Toyota çalışanları için haftalık yemek planlama ve rezervasyon sistemi.")
                                .font(AppTypography.body1())
                                .foregroundColor(AppColors.textSecondary)
                                .multilineTextAlignment(.center)
                            
                            Text("Alakart ve Japon restoranlarından seçim yapın.")
                                .font(AppTypography.body1())
                                .foregroundColor(AppColors.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(.horizontal, AppSpacing.md)
                        
                        // Get Started Button
                        PrimaryButton(
                            title: "Giriş Yap",
                            action: {
                                navigateToLogin = true
                            }
                        )
                        .padding(.horizontal, AppSpacing.lg)
                        .padding(.top, AppSpacing.md)
                        
                        // Feature Cards
                        VStack(spacing: AppSpacing.lg) {
                            FeatureCard(
                                icon: "calendar",
                                title: "Haftalık Rezervasyon",
                                description: "Maksimum 2 günlük rezervasyon yapın, menü ve restoran seçiminizi kolayca yapın",
                                gradient: LinearGradient(
                                    colors: [AppColors.gradientPurpleStart, AppColors.gradientPurpleEnd],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            
                            FeatureCard(
                                icon: "menucard",
                                title: "Menü Çeşitleri",
                                description: "Standart menü, özel menü ve aparetif seçenekleri ile zengin alternatifler",
                                gradient: LinearGradient(
                                    colors: [AppColors.gradientBlueStart, AppColors.gradientBlueEnd],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            
                            FeatureCard(
                                icon: "storefront",
                                title: "İki Restoran Seçeneği",
                                description: "Alakart Restoran ve Japon Restoran'dan tercihinize göre seçim yapın",
                                gradient: LinearGradient(
                                    colors: [AppColors.gradientCyanStart, AppColors.gradientCyanEnd],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                        }
                        .padding(.horizontal, AppSpacing.lg)
                        .padding(.bottom, AppSpacing.xl2)
                    }
                }
            }
            .navigationDestination(isPresented: $navigateToLogin) {
                LoginView()
            }
        }
    }
}

#Preview {
    OnboardingView()
}

