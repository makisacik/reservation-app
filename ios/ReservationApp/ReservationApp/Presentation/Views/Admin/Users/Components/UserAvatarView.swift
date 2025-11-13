//
//  UserAvatarView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct UserAvatarView: View {
    let name: String?
    let size: CGFloat
    
    var body: some View {
        ZStack {
            Circle()
                .fill(AppColors.primaryMain)
                .frame(width: size, height: size)
            
            Text(getInitials(from: name))
                .font(.system(size: size * 0.4, weight: .semibold))
                .foregroundColor(.white)
        }
    }
    
    private func getInitials(from name: String?) -> String {
        guard let name = name, !name.isEmpty else { return "?" }
        let parts = name.trimmingCharacters(in: .whitespaces).split(separator: " ")
        if parts.count >= 2 {
            return String(parts[0].prefix(1) + parts[parts.count - 1].prefix(1)).uppercased()
        }
        return String(name.prefix(2)).uppercased()
    }
}

