//
//  ReservationSettingsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationSettingsView: View {
    @ObservedObject var viewModel: SettingsViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Rezervasyon Ayarları")
                    .font(AppTypography.h5())
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.primaryMain)
                
                Text("Rezervasyon kurallarını yapılandırın")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textTertiary)
            }
            
            // Max Advance Reservation Days
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Maksimum İleri Tarihli Rezervasyon (Gün)")
                    .font(AppTypography.body2())
                    .fontWeight(.medium)
                    .foregroundColor(AppColors.textPrimary)
                
                TextField("Gün", text: $viewModel.maxAdvanceReservationDays)
                    .keyboardType(.numberPad)
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
            
            // Min Cancellation Hours
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("İptal İçin Minimum Süre (Saat)")
                    .font(AppTypography.body2())
                    .fontWeight(.medium)
                    .foregroundColor(AppColors.textPrimary)
                
                TextField("Saat", text: $viewModel.minCancellationHours)
                    .keyboardType(.numberPad)
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
            
            // Auto Approval Toggle
            HStack {
                VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                    Text("Otomatik Onay")
                        .font(AppTypography.body2())
                        .fontWeight(.medium)
                        .foregroundColor(AppColors.textPrimary)
                    
                    Text("Rezervasyonları otomatik olarak onayla")
                        .font(AppTypography.body2())
                        .foregroundColor(AppColors.textTertiary)
                }
                
                Spacer()
                
                Toggle("", isOn: $viewModel.autoApproval)
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
                    await viewModel.saveReservationSettings()
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



