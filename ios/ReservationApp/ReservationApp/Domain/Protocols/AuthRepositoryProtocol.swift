//
//  AuthRepositoryProtocol.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

protocol AuthRepositoryProtocol {
    func login(email: String, password: String) async throws -> AuthResponse
    func register(request: RegisterRequest) async throws -> AuthResponse
    func getCurrentUser() async throws -> User
    func updateUserProfile(request: UpdateUserProfileRequest) async throws -> User
}

