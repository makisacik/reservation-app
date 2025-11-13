//
//  NotificationSettingsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct NotificationSettingsView: View {
    @ObservedObject var viewModel: SettingsViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Bildirim Ayarları")
                    .font(AppTypography.h5())
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.primaryMain)
                
                Text("Bildirim tercihlerini yönetin")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textTertiary)
            }
            
            // Email Notifications Toggle
            HStack {
                VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                    Text("E-posta Bildirimleri")
                        .font(AppTypography.body2())
                        .fontWeight(.medium)
                        .foregroundColor(AppColors.textPrimary)
                    
                    Text("Rezervasyon onayları için e-posta gönder")
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textTertiary)
                }
                
                Spacer()
                
                Toggle("", isOn: $viewModel.emailEnabled)
                    .tint(AppColors.primaryMain)
            }
            .padding(ThemeManager.shared.spacing.md)
            .background(AppColors.backgroundPaper)
            .cornerRadius(ThemeManager.shared.borderRadius.input.value)
            .overlay(
                RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.input.value)
                    .stroke(AppColors.borderDefault, lineWidth: 1)
            )
            
            // Save Button
            Button(action: {
                Task {
                    await viewModel.saveNotificationSettings()
                }
            }) {
                HStack {
                    if viewModel.isSaving {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Image(systemName: "checkmark.circle.fill")
                    }
                    Text(viewModel.isSaving ? "Kaydediliyor..." : "Kaydet")
                        .font(AppTypography.button())
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, ThemeManager.shared.spacing.md)
                .background(AppColors.primaryMain)
                .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            }
            .disabled(viewModel.isSaving)
        }
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

