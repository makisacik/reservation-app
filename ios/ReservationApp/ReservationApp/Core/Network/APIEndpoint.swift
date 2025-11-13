//
//  APIEndpoint.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

enum APIEndpoint {
    case login
    case register
    case currentUser
    case allUsers
    case adminUsers
    
    var path: String {
        switch self {
        case .login:
            return "/auth/login"
        case .register:
            return "/auth/register"
        case .currentUser:
            return "/users/me"
        case .allUsers:
            return "/users"
        case .adminUsers:
            return "/admin/users"
        }
    }
    
    var method: String {
        switch self {
        case .login, .register:
            return "POST"
        case .currentUser, .allUsers, .adminUsers:
            return "GET"
        }
    }
}

