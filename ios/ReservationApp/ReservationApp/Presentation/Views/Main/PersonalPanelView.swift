//
//  PersonalPanelView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct PersonalPanelView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: ThemeManager.shared.spacing.lg) {
                // Header Section (Placeholder)
                PersonalHeaderPlaceholder()
                
                // Stats Section (Placeholder)
                StatsSectionPlaceholder()
                
                // Menu Section (Placeholder)
                MenuSectionPlaceholder()
            }
            .padding(ThemeManager.shared.spacing.md)
        }
        .background(AppColors.backgroundPage)
    }
}

// Placeholder components (will be replaced in Phase 2)
struct PersonalHeaderPlaceholder: View {
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            // Avatar placeholder
            ZStack {
                Circle()
                    .fill(Color.white)
                    .frame(width: 80, height: 80)
                
                Image(systemName: "person.fill")
                    .font(.system(size: 40))
                    .foregroundColor(AppColors.primaryMain)
            }
            
            // Name placeholder
            Text("Kullanıcı Adı")
                .font(AppTypography.h5())
                .foregroundColor(AppColors.textPrimary)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.lg)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [
                    AppColors.gradientPrimaryStart,
                    AppColors.gradientPrimaryEnd
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(ThemeManager.BorderRadius.card.value)
        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 2)
    }
}

struct StatsSectionPlaceholder: View {
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
            Text("İstatistikler")
                .font(AppTypography.h5())
                .foregroundColor(AppColors.textPrimary)
            
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: ThemeManager.shared.spacing.md),
                GridItem(.flexible(), spacing: ThemeManager.shared.spacing.md)
            ], spacing: ThemeManager.shared.spacing.md) {
                StatCardPlaceholder(
                    icon: "calendar",
                    label: "Toplam Rezervasyon",
                    value: "--"
                )
                
                StatCardPlaceholder(
                    icon: "checkmark.circle",
                    label: "Aktif Rezervasyon",
                    value: "--"
                )
                
                StatCardPlaceholder(
                    icon: "clock",
                    label: "Bekleyen",
                    value: "--"
                )
                
                StatCardPlaceholder(
                    icon: "xmark.circle",
                    label: "İptal Edilen",
                    value: "--"
                )
            }
        }
    }
}

struct StatCardPlaceholder: View {
    let icon: String
    let label: String
    let value: String
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(AppColors.primaryMain)
            
            Text(value)
                .font(AppTypography.h5())
                .foregroundColor(AppColors.textPrimary)
            
            Text(label)
                .font(AppTypography.caption())
                .foregroundColor(AppColors.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.md)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.BorderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct MenuSectionPlaceholder: View {
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
            Text("Menü")
                .font(AppTypography.h5())
                .foregroundColor(AppColors.textPrimary)
            
            Text("Yakında eklenecek...")
                .font(AppTypography.body1())
                .foregroundColor(AppColors.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(ThemeManager.shared.spacing.md)
                .background(AppColors.backgroundPaper)
                .cornerRadius(ThemeManager.BorderRadius.card.value)
        }
    }
}

