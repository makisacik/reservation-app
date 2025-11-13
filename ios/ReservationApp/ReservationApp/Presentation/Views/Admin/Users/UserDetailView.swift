//
//  UserDetailView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct UserDetailView: View {
    let user: User?
    @Binding var isPresented: Bool
    
    var body: some View {
        NavigationStack {
            ScrollView {
                if let user = user {
                    VStack(spacing: ThemeManager.shared.spacing.lg) {
                        // Avatar and Name Section
                        VStack(spacing: ThemeManager.shared.spacing.md) {
                            UserAvatarView(name: user.name, size: 64)
                            
                            Text(user.name)
                                .font(AppTypography.h6())
                                .fontWeight(.semibold)
                                .foregroundColor(AppColors.textPrimary)
                            
                            Text(user.email)
                                .font(AppTypography.body2())
                                .foregroundColor(AppColors.textSecondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(ThemeManager.shared.spacing.lg)
                        .background(AppColors.backgroundPaper)
                        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
                        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
                        
                        // Details Section
                        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
                            DetailRow(label: "E-posta", value: user.email)
                            
                            Divider()
                            
                            DetailRow(label: "Departman", value: user.department ?? "-")
                            
                            Divider()
                            
                            DetailRow(label: "Rol", value: user.role.displayName)
                            
                            Divider()
                            
                            HStack {
                                Text("Durum")
                                    .font(AppTypography.body2())
                                    .foregroundColor(AppColors.textSecondary)
                                
                                Spacer()
                                
                                if let status = user.status {
                                    StatusBadgeView(status: status)
                                }
                            }
                            
                            Divider()
                            
                            DetailRow(label: "Toplam Rezervasyon", value: "\(user.totalReservations ?? 0)")
                            
                            Divider()
                            
                            if let createdAt = user.createdAt {
                                DetailRow(label: "Kayıt Tarihi", value: formatDate(createdAt))
                            }
                        }
                        .padding(ThemeManager.shared.spacing.lg)
                        .background(AppColors.backgroundPaper)
                        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
                        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
                    }
                    .padding(ThemeManager.shared.spacing.md)
                } else {
                    Text("Kullanıcı bulunamadı")
                        .font(AppTypography.body1())
                        .foregroundColor(AppColors.textSecondary)
                        .frame(maxWidth: .infinity)
                        .padding(ThemeManager.shared.spacing.xl)
                }
            }
            .background(AppColors.backgroundPage)
            .navigationTitle("Kullanıcı Detayları")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Kapat") {
                        isPresented = false
                    }
                }
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
}

