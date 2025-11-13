//
//  UserInfoView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct UserInfoView: View {
    let user: User?
    
    var body: some View {
        HStack(spacing: AppSpacing.md) {
            // Avatar with initials
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [AppColors.primaryLight, AppColors.primaryMain],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 60, height: 60)
                
                Text(getInitials(from: user?.name))
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
            }
            
            // Name and Department
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(user?.name ?? "Kullanıcı")
                    .font(AppTypography.h6())
                    .foregroundColor(.white)
                    .bold()
                
                if let department = user?.department, !department.isEmpty {
                    Text(department)
                        .font(AppTypography.body2())
                        .foregroundColor(.white.opacity(0.9))
                }
            }
        }
    }
    
    private func getInitials(from name: String?) -> String {
        guard let name = name, !name.isEmpty else {
            return "?"
        }
        
        let words = name.trimmingCharacters(in: .whitespaces).components(separatedBy: .whitespaces)
        
        guard !words.isEmpty else {
            return "?"
        }
        
        // Take first letter of first word
        var initials = String(words[0].prefix(1)).uppercased()
        
        // If there's a second word, take its first letter too
        if words.count > 1 {
            initials += String(words[1].prefix(1)).uppercased()
        }
        
        return initials
    }
}

