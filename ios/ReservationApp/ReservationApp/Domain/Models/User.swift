//
//  User.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct User: Codable, Identifiable {
    let id: String // UUID from backend (Guid)
    let name: String
    let email: String
    let department: String?
    let role: UserRole
    let status: UserStatus?
    let createdAt: String? // ISO date string
    let totalReservations: Int?
    
    var isAdmin: Bool {
        return role == .admin
    }
}

enum UserRole: String, Codable {
    case admin = "Admin"
    case user = "User"
    case personel = "Personel"
    
    var displayName: String {
        switch self {
        case .admin:
            return "Admin"
        case .user, .personel:
            return "Personel"
        }
    }
}

enum UserStatus: String, Codable {
    case active = "Active"
    case passive = "Passive"
}

