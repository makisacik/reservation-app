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
    @State private var showMakeReservation = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: ThemeManager.shared.spacing.lg) {
                // Header Section
                PersonalHeaderView(
                    user: viewModel.user
                )
                
                // Notification Card
                NotificationCardView(alertMessage: viewModel.alertMessage)
                
                // Stats Section
                StatsGridView(stats: viewModel.stats)
                
                // Menu Section
                MenuSectionView(
                    categories: viewModel.categories,
                    selectedCategory: viewModel.selectedCategory,
                    meals: viewModel.displayedMeals,
                    isLoading: viewModel.isLoading,
                    onCategorySelected: { category in
                        viewModel.selectCategory(category)
                    },
                    onReservationTap: {
                        // Navigate to reservation screen
                        showMakeReservation = true
                    }
                )
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
        .sheet(isPresented: $showMakeReservation) {
            MakeReservationView()
        }
    }
}

