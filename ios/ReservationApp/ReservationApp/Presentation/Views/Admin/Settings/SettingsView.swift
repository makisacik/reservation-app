//
//  SettingsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct SettingsView: View {
    @StateObject private var viewModel = SettingsViewModel()
    @State private var selectedTab: SettingsTab = .general
    @State private var showLogoutConfirmation = false
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ThemeManager.shared.spacing.lg) {
                    // Header
                    VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                        Text("Ayarlar")
                            .font(AppTypography.h4())
                            .foregroundColor(AppColors.primaryMain)
                        
                        Text("Sistem ayarlarını yapılandırın")
                            .font(AppTypography.body2())
                            .foregroundColor(AppColors.textTertiary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    
                    // Tabs
                    SettingsTabsView(selectedTab: $selectedTab)
                    
                    // Content
                    if viewModel.isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                            .padding(ThemeManager.shared.spacing.xl)
                    } else {
                        Group {
                            switch selectedTab {
                            case .general:
                                GeneralSettingsView(viewModel: viewModel)
                            case .reservation:
                                ReservationSettingsView(viewModel: viewModel)
                            case .notification:
                                NotificationSettingsView(viewModel: viewModel)
                            }
                        }
                        
                        // Logout Button
                        Button(action: {
                            showLogoutConfirmation = true
                        }) {
                            HStack {
                                Image(systemName: "rectangle.portrait.and.arrow.right")
                                Text("Çıkış Yap")
                                    .font(AppTypography.button())
                            }
                            .foregroundColor(AppColors.errorMain)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, ThemeManager.shared.spacing.md)
                            .background(AppColors.backgroundPaper)
                            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                            .overlay(
                                RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                                    .stroke(AppColors.errorMain, lineWidth: 1)
                            )
                        }
                        .padding(.top, ThemeManager.shared.spacing.md)
                    }
                }
                .padding(ThemeManager.shared.spacing.md)
            }
            .background(AppColors.backgroundPage)
            .refreshable {
                await viewModel.loadSettings()
            }
            .task {
                await viewModel.loadSettings()
            }
            .alert("Hata", isPresented: Binding(
                get: { viewModel.errorMessage != nil },
                set: { if !$0 { viewModel.errorMessage = nil } }
            )) {
                Button("Tamam") {
                    viewModel.errorMessage = nil
                }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
            .alert("Başarılı", isPresented: Binding(
                get: { viewModel.successMessage != nil },
                set: { if !$0 { viewModel.successMessage = nil } }
            )) {
                Button("Tamam") {
                    viewModel.successMessage = nil
                }
            } message: {
                Text(viewModel.successMessage ?? "")
            }
            .confirmationDialog(
                "Çıkış Yap",
                isPresented: $showLogoutConfirmation,
                titleVisibility: .visible
            ) {
                Button("Çıkış Yap", role: .destructive) {
                    viewModel.logout()
                }
                Button("İptal", role: .cancel) {
                    // Cancel action
                }
            } message: {
                Text("Çıkış yapmak istediğinizden emin misiniz?")
            }
        }
    }
}

enum SettingsTab: String, CaseIterable {
    case general = "general"
    case reservation = "reservation"
    case notification = "notification"
    
    var displayName: String {
        switch self {
        case .general: return "Genel"
        case .reservation: return "Rezervasyonlar"
        case .notification: return "Bildirimler"
        }
    }
}

struct SettingsTabsView: View {
    @Binding var selectedTab: SettingsTab
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: ThemeManager.shared.spacing.sm) {
                ForEach(SettingsTab.allCases, id: \.self) { tab in
                    SettingsTabButton(
                        title: tab.displayName,
                        isSelected: selectedTab == tab,
                        action: {
                            selectedTab = tab
                        }
                    )
                }
            }
            .padding(.horizontal, ThemeManager.shared.spacing.md)
        }
    }
}

struct SettingsTabButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(AppTypography.body1())
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundColor(isSelected ? AppColors.primaryMain : AppColors.textSecondary)
                .padding(.horizontal, ThemeManager.shared.spacing.lg)
                .padding(.vertical, ThemeManager.shared.spacing.md)
                .background(isSelected ? AppColors.backgroundActiveTab : Color.clear)
                .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                .overlay(
                    RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                        .stroke(isSelected ? Color.clear : AppColors.borderDefault, lineWidth: 1)
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

