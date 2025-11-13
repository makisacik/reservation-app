//
//  AppConstants.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct AppConstants {
    // API Configuration
    struct API {
        // Use 127.0.0.1 instead of localhost for iOS Simulator compatibility
        static let baseURL = "http://127.0.0.1:5053/api"
        
        struct Endpoints {
            // Auth endpoints
            static let login = "/auth/login"
            static let register = "/auth/register"
            
            // User endpoints
            static let currentUser = "/users/me"
            static let allUsers = "/users"
            static let adminUsers = "/admin/users"
        }
    }
    
    // Storage Keys
    struct StorageKeys {
        static let token = "auth_token"
        static let user = "user_data"
    }
    
    // User Roles
    enum UserRole: String, Codable {
        case admin = "Admin"
        case user = "User"
        case personel = "Personel"
        
        var isAdmin: Bool {
            return self == .admin
        }
    }
}

