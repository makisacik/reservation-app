//
//  AuthResponse.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct AuthResponse: Codable {
    let token: String?
    let Token: String?
    
    var authToken: String {
        return token ?? Token ?? ""
    }
}

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct RegisterRequest: Codable {
    let email: String
    let password: String
    let firstName: String?
    let lastName: String?
}

