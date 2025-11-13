//
//  AuthRepository.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

class AuthRepository: AuthRepositoryProtocol {
    private let apiClient: APIClient
    private let keychainManager: KeychainManager
    
    init(apiClient: APIClient = APIClient.shared, keychainManager: KeychainManager = KeychainManager.shared) {
        self.apiClient = apiClient
        self.keychainManager = keychainManager
    }
    
    func login(email: String, password: String) async throws -> AuthResponse {
        let request = LoginRequest(email: email, password: password)
        let response: AuthResponse = try await apiClient.request(
            endpoint: .login,
            body: request,
            responseType: AuthResponse.self
        )
        
        // Save token to keychain
        if !response.authToken.isEmpty {
            _ = keychainManager.saveToken(response.authToken)
        }
        
        return response
    }
    
    func register(request: RegisterRequest) async throws -> AuthResponse {
        let response: AuthResponse = try await apiClient.request(
            endpoint: .register,
            body: request,
            responseType: AuthResponse.self
        )
        
        // Save token to keychain if provided
        if !response.authToken.isEmpty {
            _ = keychainManager.saveToken(response.authToken)
        }
        
        return response
    }
    
    func getCurrentUser() async throws -> User {
        let user: User = try await apiClient.request(
            endpoint: .currentUser,
            responseType: User.self
        )
        return user
    }
}

