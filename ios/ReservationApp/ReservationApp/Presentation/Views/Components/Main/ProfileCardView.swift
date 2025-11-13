//
//  ProfileCardView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ProfileCardView: View {
    let user: User?
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            // Avatar
            AvatarView(user: user)
            
            // Name
            Text(user?.name ?? "Kullanıcı")
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textPrimary)
            
            // Department
            Text(user?.department ?? "Departman Belirtilmemiş")
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
            
            // Role Badge
            if let user = user {
                RoleBadge(role: user.role)
            }
            
            // Membership Date
            if let createdAt = user?.createdAt {
                MembershipDateView(dateString: createdAt)
            }
            
            // Location
            LocationView()
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.lg)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct AvatarView: View {
    let user: User?
    
    var body: some View {
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [AppColors.primaryLight, AppColors.primaryMain],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 120, height: 120)
            
            Text(getInitials(from: user?.name))
                .font(.system(size: 48, weight: .semibold))
                .foregroundColor(.white)
        }
    }
    
    private func getInitials(from name: String?) -> String {
        guard let name = name, !name.isEmpty else { return "U" }
        let parts = name.split(separator: " ").filter { !$0.isEmpty }
        if parts.count >= 2 {
            return String(parts[0].prefix(1) + parts[parts.count - 1].prefix(1)).uppercased()
        }
        return String(name.prefix(2)).uppercased()
    }
}

struct RoleBadge: View {
    let role: UserRole
    
    var body: some View {
        Text(role.displayName)
            .font(AppTypography.caption())
            .fontWeight(.medium)
            .foregroundColor(.white)
            .padding(.horizontal, ThemeManager.shared.spacing.sm)
            .padding(.vertical, ThemeManager.shared.spacing.xs)
            .background(AppColors.primaryLight)
            .cornerRadius(ThemeManager.shared.borderRadius.chip.value)
    }
}

struct MembershipDateView: View {
    let dateString: String
    
    var body: some View {
        HStack(spacing: ThemeManager.shared.spacing.xs) {
            Image(systemName: "calendar")
                .font(.system(size: 16))
                .foregroundColor(AppColors.textTertiary)
            
            Text(formatDate(dateString))
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
        }
    }
    
    private func formatDate(_ dateString: String) -> String {
        // Format date as "Üyelik: Ocak 2025"
        // Parse ISO date and format
        // TODO: Implement proper Turkish date formatting
        if let date = ISO8601DateFormatter().date(from: dateString) {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "tr_TR")
            formatter.dateFormat = "MMMM yyyy"
            return "Üyelik: \(formatter.string(from: date))"
        }
        return "Üyelik: \(dateString)" // Fallback
    }
}

struct LocationView: View {
    var body: some View {
        HStack(spacing: ThemeManager.shared.spacing.xs) {
            Image(systemName: "location.fill")
                .font(.system(size: 16))
                .foregroundColor(AppColors.textTertiary)
            
            Text("Şirket Merkez")
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textSecondary)
        }
    }
}

