//
//  ReservationDetailView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI
import Combine

struct ReservationDetailView: View {
    let reservationId: String?
    @Binding var isPresented: Bool
    @StateObject private var viewModel = ReservationDetailViewModel()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                if viewModel.isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity)
                        .padding(ThemeManager.shared.spacing.xl)
                } else if let reservation = viewModel.reservation {
                    VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
                        // Reservation Number Card
                        ReservationNumberCard(number: reservation.reservationNumber)
                        
                        Divider()
                        
                        // Details Grid
                        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
                            DetailRow(label: "Kullanıcı", value: reservation.userName)
                            DetailRow(label: "Durum", value: ReservationStatus(rawValue: reservation.status)?.displayName ?? reservation.status)
                            DetailRow(label: "Tarih", value: formatDate(reservation.date))
                            DetailRow(label: "Öğün", value: reservation.mealTimeSlotName)
                            DetailRow(label: "Restoran", value: reservation.restaurantName)
                            DetailRow(label: "Menü", value: reservation.menuName.isEmpty ? "-" : reservation.menuName)
                            DetailRow(label: "Çorba", value: reservation.appetizer ? "Evet" : "Hayır")
                            
                            Divider()
                            
                            DetailRow(label: "Oluşturulma Tarihi", value: formatDateTime(reservation.createdAt))
                            if let updatedAt = reservation.updatedAt {
                                DetailRow(label: "Güncellenme Tarihi", value: formatDateTime(updatedAt))
                            }
                        }
                    }
                    .padding(ThemeManager.shared.spacing.lg)
                } else {
                    Text("Rezervasyon bulunamadı")
                        .font(AppTypography.body1())
                        .foregroundColor(AppColors.textSecondary)
                        .frame(maxWidth: .infinity)
                        .padding(ThemeManager.shared.spacing.xl)
                }
            }
            .background(AppColors.backgroundPage)
            .navigationTitle("Rezervasyon Detayları")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Kapat") {
                        isPresented = false
                    }
                }
            }
        }
        .task {
            if let id = reservationId {
                await viewModel.loadReservation(id: id)
            }
        }
    }
    
    private func formatDate(_ dateString: String) -> String {
        // Format as "4 Kasım 2025"
        if let date = ISO8601DateFormatter().date(from: dateString) {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "tr_TR")
            formatter.dateFormat = "d MMMM yyyy"
            return formatter.string(from: date)
        }
        return dateString // Fallback
    }
    
    private func formatDateTime(_ dateString: String) -> String {
        // Format as "4 Kasım 2025 14:30"
        if let date = ISO8601DateFormatter().date(from: dateString) {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "tr_TR")
            formatter.dateFormat = "d MMMM yyyy HH:mm"
            return formatter.string(from: date)
        }
        return dateString // Fallback
    }
}

struct ReservationNumberCard: View {
    let number: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
            Text("Rezervasyon No")
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
            
            Text(number)
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.primaryMain)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(ThemeManager.shared.spacing.md)
        .background(AppColors.backgroundPage)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
    }
}

struct DetailRow: View {
    let label: String
    let value: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
            Text(label)
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
            
            Text(value)
                .font(AppTypography.body1())
                .fontWeight(.medium)
                .foregroundColor(AppColors.textPrimary)
        }
    }
}

// ViewModel for detail view
@MainActor
class ReservationDetailViewModel: ObservableObject {
    @Published var reservation: Reservation?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let adminRepository: AdminRepositoryProtocol
    
    init(adminRepository: AdminRepositoryProtocol = AdminRepository()) {
        self.adminRepository = adminRepository
    }
    
    func loadReservation(id: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            self.reservation = try await adminRepository.getReservationById(id: id)
        } catch {
            errorMessage = "Rezervasyon yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
}

