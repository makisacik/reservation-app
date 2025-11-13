//
//  ProfileFormView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI
import Combine

struct ProfileFormView: View {
    @Binding var name: String
    @Binding var email: String
    @Binding var department: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            Text("Kişisel Bilgiler")
                .font(AppTypography.h5())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textPrimary)
            
            // Name Field
            FormField(
                label: "Ad Soyad",
                text: $name,
                icon: "person.fill",
                isEditable: true
            )
            
            // Email Field (read-only)
            FormField(
                label: "E-posta",
                text: $email,
                icon: "envelope.fill",
                isEditable: false
            )
            
            // Department Field
            FormField(
                label: "Departman",
                text: $department,
                icon: "building.2.fill",
                isEditable: true
            )
        }
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct FormField: View {
    let label: String
    @Binding var text: String
    let icon: String
    let isEditable: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
            Text(label)
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
            
            HStack(spacing: ThemeManager.shared.spacing.sm) {
                Image(systemName: icon)
                    .foregroundColor(AppColors.textTertiary)
                    .frame(width: 20)
                
                if isEditable {
                    TextField("", text: $text)
                        .font(AppTypography.body1())
                        .foregroundColor(AppColors.textPrimary)
                } else {
                    Text(text)
                        .font(AppTypography.body1())
                        .foregroundColor(AppColors.textSecondary)
                }
            }
            .padding(ThemeManager.shared.spacing.md)
            .background(isEditable ? AppColors.backgroundPaper : AppColors.backgroundLight)
            .overlay(
                RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.input.value)
                    .stroke(AppColors.borderDefault, lineWidth: 1)
            )
            .cornerRadius(ThemeManager.shared.borderRadius.input.value)
        }
    }
}

