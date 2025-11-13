//
//  ReservationsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationsView: View {
    @StateObject private var viewModel = ReservationsViewModel()
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Rezervasyonlarım")
                    .font(AppTypography.h4())
                    .foregroundColor(AppColors.textPrimary)
                
                Text("Geçmiş ve aktif rezervasyonlarınız")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textTertiary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(ThemeManager.shared.spacing.lg)
            
            // Tabs
            HStack(spacing: ThemeManager.shared.spacing.md) {
                TabButton(
                    title: "Aktif Rezervasyonlar",
                    isSelected: viewModel.activeTab == .active
                ) {
                    viewModel.activeTab = .active
                }
                
                TabButton(
                    title: "Geçmiş Rezervasyonlar",
                    isSelected: viewModel.activeTab == .past
                ) {
                    viewModel.activeTab = .past
                }
            }
            .padding(.horizontal, ThemeManager.shared.spacing.lg)
            .padding(.bottom, ThemeManager.shared.spacing.md)
            
            // Content
            ScrollView {
                if viewModel.isLoading {
                    ProgressView()
                        .padding(ThemeManager.shared.spacing.xl)
                } else if viewModel.filteredReservations.isEmpty {
                    EmptyReservationsView(tab: viewModel.activeTab)
                } else {
                    LazyVStack(spacing: ThemeManager.shared.spacing.md) {
                        ForEach(viewModel.filteredReservations) { reservation in
                            ReservationCardView(
                                reservation: reservation,
                                mealName: getMealName(for: reservation)
                            )
                        }
                    }
                    .padding(ThemeManager.shared.spacing.lg)
                }
            }
            .refreshable {
                await viewModel.refresh()
            }
        }
        .background(AppColors.backgroundPage)
        .task {
            await viewModel.loadReservations()
        }
    }
    
    private func getMealName(for reservation: Reservation) -> String {
        // Get meal name from menu
        // For now, return menu name or default
        return reservation.menuName.isEmpty ? "Menü" : reservation.menuName
    }
}

struct TabButton: View {
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

struct EmptyReservationsView: View {
    let tab: ReservationTab
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            Image(systemName: "calendar.badge.exclamationmark")
                .font(.system(size: 48))
                .foregroundColor(AppColors.textTertiary)
            
            Text(tab == .active ? "Aktif rezervasyonunuz bulunmamaktadır." : "Geçmiş rezervasyonunuz bulunmamaktadır.")
                .font(AppTypography.body1())
                .foregroundColor(AppColors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.xl)
    }
}

