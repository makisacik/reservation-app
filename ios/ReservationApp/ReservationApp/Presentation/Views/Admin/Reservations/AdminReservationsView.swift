//
//  AdminReservationsView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AdminReservationsView: View {
    @StateObject private var viewModel = AdminReservationsViewModel()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ThemeManager.shared.spacing.lg) {
                    // Header
                    HStack {
                        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                            Text("Rezervasyonlar")
                                .font(AppTypography.h4())
                                .foregroundColor(AppColors.textPrimary)
                            
                            Text("Tüm rezervasyonları görüntüleyin ve yönetin")
                                .font(AppTypography.body2())
                                .foregroundColor(AppColors.textSecondary)
                        }
                        
                        Spacer()
                        
                        Button(action: {
                            viewModel.showCreateModal = true
                        }) {
                            HStack {
                                Image(systemName: "plus")
                                Text("Rezervasyon")
                            }
                            .font(AppTypography.button())
                            .foregroundColor(.white)
                            .padding(.horizontal, ThemeManager.shared.spacing.lg)
                            .padding(.vertical, ThemeManager.shared.spacing.md)
                            .background(AppColors.primaryMain)
                            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                        }
                    }
                    
                    // Filters
                    ReservationFiltersView(viewModel: viewModel)
                    
                    // Summary Cards
                    ReservationSummaryCardsView(
                        summary: viewModel.summary,
                        isLoading: viewModel.isLoading
                    )
                    
                    // Reservations List
                    VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
                        Text("Rezervasyon Listesi")
                            .font(AppTypography.h6())
                            .fontWeight(.semibold)
                            .foregroundColor(AppColors.textPrimary)
                        
                        if viewModel.isLoading && viewModel.reservations.isEmpty {
                            ProgressView()
                                .frame(maxWidth: .infinity)
                                .padding(ThemeManager.shared.spacing.xl)
                        } else if viewModel.reservations.isEmpty {
                            AdminEmptyReservationsView()
                        } else {
                            ForEach(viewModel.reservations) { reservation in
                                ReservationRowView(
                                    reservation: reservation,
                                    onDetailTap: {
                                        viewModel.selectedReservationId = reservation.id
                                        viewModel.showDetailModal = true
                                    },
                                    onApproveTap: {
                                        viewModel.reservationToApprove = reservation
                                        viewModel.showApprovalDialog = true
                                    }
                                )
                            }
                            
                            // Pagination
                            PaginationView(
                                currentPage: viewModel.currentPage,
                                totalPages: (viewModel.totalCount + viewModel.pageSize - 1) / viewModel.pageSize,
                                pageSize: viewModel.pageSize,
                                onPageChange: { page in
                                    viewModel.changePage(page)
                                }
                            )
                        }
                    }
                }
                .padding(ThemeManager.shared.spacing.md)
            }
            .background(AppColors.backgroundPage)
            .refreshable {
                await viewModel.refresh()
            }
            .task {
                await viewModel.loadReservations()
            }
            .sheet(isPresented: $viewModel.showCreateModal) {
                CreateReservationView(
                    isPresented: $viewModel.showCreateModal,
                    viewModel: viewModel
                )
            }
            .sheet(isPresented: $viewModel.showDetailModal) {
                ReservationDetailView(
                    reservationId: viewModel.selectedReservationId,
                    isPresented: $viewModel.showDetailModal
                )
            }
            .alert("Rezervasyon Onaylama", isPresented: $viewModel.showApprovalDialog) {
                Button("İptal", role: .cancel) {
                    viewModel.reservationToApprove = nil
                }
                Button("Onayla") {
                    if let reservation = viewModel.reservationToApprove {
                        Task {
                            await viewModel.approveReservation(reservation)
                        }
                    }
                }
            } message: {
                if let reservation = viewModel.reservationToApprove {
                    Text("Rezervasyon No: \(reservation.reservationNumber) onaylanacak. Onaylamak istiyor musunuz?")
                }
            }
            .alert("Hata", isPresented: .constant(viewModel.errorMessage != nil)) {
                Button("Tamam") {
                    viewModel.errorMessage = nil
                }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
            .alert("Başarılı", isPresented: .constant(viewModel.successMessage != nil)) {
                Button("Tamam") {
                    viewModel.successMessage = nil
                }
            } message: {
                Text(viewModel.successMessage ?? "")
            }
        }
    }
}

struct AdminEmptyReservationsView: View {
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            Image(systemName: "calendar.badge.exclamationmark")
                .font(.system(size: 48))
                .foregroundColor(AppColors.textTertiary)
            
            Text("Rezervasyon bulunamadı")
                .font(AppTypography.body1())
                .foregroundColor(AppColors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.xl)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
    }
}

struct PaginationView: View {
    let currentPage: Int
    let totalPages: Int
    let pageSize: Int
    let onPageChange: (Int) -> Void
    
    var body: some View {
        HStack {
            Button(action: {
                if currentPage > 0 {
                    onPageChange(currentPage - 1)
                }
            }) {
                Image(systemName: "chevron.left")
            }
            .disabled(currentPage == 0)
            
            Text("Sayfa \(currentPage + 1) / \(max(totalPages, 1))")
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
            
            Button(action: {
                if currentPage < totalPages - 1 {
                    onPageChange(currentPage + 1)
                }
            }) {
                Image(systemName: "chevron.right")
            }
            .disabled(currentPage >= totalPages - 1)
        }
        .padding(ThemeManager.shared.spacing.md)
    }
}

