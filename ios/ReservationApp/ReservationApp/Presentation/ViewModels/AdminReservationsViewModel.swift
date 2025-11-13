//
//  AdminReservationsViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class AdminReservationsViewModel: ObservableObject {
    @Published var reservations: [Reservation] = []
    @Published var summary: ReservationSummary?
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var successMessage: String?
    
    // Pagination
    @Published var currentPage: Int = 0
    @Published var pageSize: Int = 10
    @Published var totalCount: Int = 0
    
    // Filters
    @Published var searchQuery: String = ""
    @Published var statusFilter: ReservationStatusFilter = .all
    @Published var dateFrom: Date?
    @Published var dateTo: Date?
    
    // Modals
    @Published var showCreateModal = false
    @Published var showDetailModal = false
    @Published var showApprovalDialog = false
    @Published var selectedReservationId: String?
    @Published var reservationToApprove: Reservation?
    
    private let adminRepository: AdminRepositoryProtocol
    
    init(adminRepository: AdminRepositoryProtocol = AdminRepository()) {
        self.adminRepository = adminRepository
        
        // Set default date range to current month
        let calendar = Calendar.current
        let now = Date()
        dateFrom = calendar.date(from: calendar.dateComponents([.year, .month], from: now))
        dateTo = calendar.date(byAdding: .month, value: 1, to: dateFrom ?? now)
    }
    
    func loadReservations() async {
        isLoading = true
        errorMessage = nil
        
        let queryParams = AdminReservationQueryParams(
            page: currentPage + 1,
            pageSize: pageSize,
            dateFrom: formatDate(dateFrom),
            dateTo: formatDate(dateTo),
            search: searchQuery.isEmpty ? nil : searchQuery,
            status: statusFilter == .all ? nil : statusFilter.rawValue
        )
        
        do {
            // Use Task to handle isolation properly
            let result = try await adminRepository.getAdminReservations(queryParams: queryParams)
            let summaryResult = try await adminRepository.getReservationSummary()
            
            self.reservations = result.data
            self.totalCount = result.totalCount
            self.summary = summaryResult
        } catch let error as NetworkError {
            // Provide more specific error messages
            errorMessage = error.errorDescription ?? "Rezervasyonlar yüklenirken bir hata oluştu."
        } catch {
            errorMessage = "Rezervasyonlar yüklenirken bir hata oluştu: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    func refresh() async {
        await loadReservations()
    }
    
    func approveReservation(_ reservation: Reservation) async {
        // Close dialog first
        showApprovalDialog = false
        reservationToApprove = nil
        
        // Optimistically update the reservation status in the local array
        if let index = reservations.firstIndex(where: { $0.id == reservation.id }) {
            // Create updated reservation with new status
            let updatedReservation = Reservation(
                id: reservation.id,
                reservationNumber: reservation.reservationNumber,
                userId: reservation.userId,
                userName: reservation.userName,
                restaurantId: reservation.restaurantId,
                restaurantName: reservation.restaurantName,
                menuId: reservation.menuId,
                menuName: reservation.menuName,
                menuDate: reservation.menuDate,
                mealTimeSlotId: reservation.mealTimeSlotId,
                mealTimeSlotName: reservation.mealTimeSlotName,
                date: reservation.date,
                appetizer: reservation.appetizer,
                status: "Active",
                createdAt: reservation.createdAt,
                updatedAt: reservation.updatedAt
            )
            reservations[index] = updatedReservation
            
            // Optimistically update summary if available
            if let currentSummary = summary {
                summary = ReservationSummary(
                    todayCount: currentSummary.todayCount,
                    thisWeekCount: currentSummary.thisWeekCount,
                    thisMonthCount: currentSummary.thisMonthCount,
                    pendingCount: max(0, currentSummary.pendingCount - 1)
                )
            }
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            try await adminRepository.approveReservation(id: reservation.id)
            successMessage = "Rezervasyon başarıyla onaylandı"
            
            // Reload reservations to sync with server
            await loadReservations()
        } catch {
            errorMessage = "Rezervasyon onaylanırken bir hata oluştu."
            // Reload on error to get correct state
            await loadReservations()
        }
        
        isLoading = false
    }
    
    func cancelReservation(_ reservation: Reservation) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await adminRepository.cancelReservation(id: reservation.id)
            successMessage = "Rezervasyon başarıyla iptal edildi"
            
            // Reload reservations to get updated status
            await loadReservations()
        } catch {
            errorMessage = "Rezervasyon iptal edilirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func createReservation(_ request: AdminCreateReservationRequest) async {
        isLoading = true
        errorMessage = nil
        
        do {
            _ = try await adminRepository.createReservation(reservationData: request)
            successMessage = "Rezervasyon başarıyla oluşturuldu"
            await loadReservations()
            showCreateModal = false
        } catch {
            errorMessage = "Rezervasyon oluşturulurken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func changePage(_ page: Int) {
        currentPage = page
        Task {
            await loadReservations()
        }
    }
    
    func applyFilters() {
        currentPage = 0
        Task {
            await loadReservations()
        }
    }
    
    private func formatDate(_ date: Date?) -> String? {
        guard let date = date else { return nil }
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withFullDate]
        return formatter.string(from: date)
    }
}

enum ReservationStatusFilter: String, CaseIterable {
    case all = "all"
    case pending = "Pending"
    case active = "Active"
    case cancelled = "Cancelled"
    
    var displayName: String {
        switch self {
        case .all: return "Tümü"
        case .pending: return "Beklemede"
        case .active: return "Onaylandı"
        case .cancelled: return "İptal"
        }
    }
}

