//
//  PersonalPanelView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct PersonalPanelView: View {
    @StateObject private var viewModel = PersonalPanelViewModel()
    @State private var showErrorAlert = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: ThemeManager.shared.spacing.lg) {
                // Header Section
                PersonalHeaderView(
                    user: viewModel.user,
                    alertMessage: nil // Phase 3
                )
                
                // Stats Section
                StatsGridView(stats: viewModel.stats)
                
                // Menu Section (Placeholder - Phase 3)
                MenuSectionPlaceholder()
            }
            .padding(ThemeManager.shared.spacing.md)
        }
        .background(AppColors.backgroundPage)
        .refreshable {
            await viewModel.refresh()
        }
        .task {
            await viewModel.loadData()
        }
        .onChange(of: viewModel.errorMessage) { _, newValue in
            showErrorAlert = newValue != nil
        }
        .overlay {
            if viewModel.isLoading && viewModel.stats == nil {
                ProgressView()
            }
        }
        .alert("Hata", isPresented: $showErrorAlert) {
            Button("Tamam") {
                viewModel.errorMessage = nil
            }
            Button("Yeniden Dene") {
                Task {
                    await viewModel.loadData()
                }
            }
        } message: {
            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
            }
        }
    }
}

// Placeholder component for Phase 3
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

