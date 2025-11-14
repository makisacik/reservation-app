//
//  ReservationsViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class ReservationsViewModel: ObservableObject {
    @Published var reservations: [Reservation] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    @Published var activeTab: ReservationTab = .active
    
    private let reservationRepository: ReservationRepositoryProtocol
    
    init(reservationRepository: ReservationRepositoryProtocol = ReservationRepository()) {
        self.reservationRepository = reservationRepository
    }
    
    func loadReservations() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let allReservations = try await reservationRepository.getMyReservations()
            self.reservations = allReservations
        } catch {
            errorMessage = "Rezervasyonlar yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func refresh() async {
        await loadReservations()
    }
    
    var filteredReservations: [Reservation] {
        let now = Date()
        return reservations.filter { reservation in
            guard let date = ISO8601DateFormatter().date(from: reservation.date) else {
                return false
            }
            
            let isPast = date < now
            let isCancelled = reservation.status.lowercased() == "cancelled"
            
            switch activeTab {
            case .active:
                return !isPast && !isCancelled
            case .past:
                return isPast || isCancelled
            }
        }
        .sorted { res1, res2 in
            guard let date1 = ISO8601DateFormatter().date(from: res1.date),
                  let date2 = ISO8601DateFormatter().date(from: res2.date) else {
                return false
            }
            return activeTab == .active ? date1 < date2 : date1 > date2
        }
    }
}

enum ReservationTab {
    case active
    case past
    
    var title: String {
        switch self {
        case .active: return "Aktif Rezervasyonlar"
        case .past: return "Geçmiş Rezervasyonlar"
        }
    }
}



