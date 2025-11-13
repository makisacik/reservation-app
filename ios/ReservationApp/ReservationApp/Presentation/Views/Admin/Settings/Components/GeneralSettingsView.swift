//
//  GeneralSettingsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct GeneralSettingsView: View {
    @ObservedObject var viewModel: SettingsViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Genel Ayarlar")
                    .font(AppTypography.h5())
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.primaryMain)
                
                Text("Sistemin genel ayarlarını düzenleyin")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textTertiary)
            }
            
            // Company Name Field
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Şirket Adı")
                    .font(AppTypography.body2())
                    .fontWeight(.medium)
                    .foregroundColor(AppColors.textPrimary)
                
                TextField("Şirket Adı", text: $viewModel.companyName)
                    .textFieldStyle(.plain)
                    .font(AppTypography.body1())
                    .padding(ThemeManager.shared.spacing.md)
                    .background(AppColors.backgroundPaper)
                    .cornerRadius(ThemeManager.shared.borderRadius.input.value)
                    .overlay(
                        RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.input.value)
                            .stroke(AppColors.borderDefault, lineWidth: 1)
                    )
            }
            
            // Timezone Field (Read-only)
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Saat Dilimi")
                    .font(AppTypography.body2())
                    .fontWeight(.medium)
                    .foregroundColor(AppColors.textPrimary)
                
                TextField("Saat Dilimi", text: .constant(viewModel.timezone))
                    .textFieldStyle(.plain)
                    .font(AppTypography.body1())
                    .padding(ThemeManager.shared.spacing.md)
                    .background(AppColors.backgroundLighter)
                    .cornerRadius(ThemeManager.shared.borderRadius.input.value)
                    .overlay(
                        RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.input.value)
                            .stroke(AppColors.borderDefault, lineWidth: 1)
                    )
                    .disabled(true)
            }
            
            // Save Button
            Button(action: {
                Task {
                    await viewModel.saveGeneralSettings()
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

