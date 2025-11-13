//
//  LoginViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine
enum LoginRole: String, CaseIterable {
    case personel = "Personel"
    case admin = "Admin"
}

@MainActor
class LoginViewModel: ObservableObject {
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var selectedRole: LoginRole = .personel
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var isAuthenticated: Bool = false
    @Published var currentUser: User?
    
    private let authRepository: AuthRepositoryProtocol
    private let keychainManager: KeychainManager
    
    var onLoginSuccess: ((User) -> Void)?
    
    init(
        authRepository: AuthRepositoryProtocol? = nil,
        keychainManager: KeychainManager? = nil
    ) {
        // Create dependencies on main actor to avoid concurrency issues
        self.authRepository = authRepository ?? AuthRepository()
        self.keychainManager = keychainManager ?? KeychainManager.shared
    }
    
    func login() async {
        // Clear previous error
        errorMessage = nil
        
        // Basic validation
        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = "Lütfen email ve şifre girin"
            return
        }
        
        // Email format validation
        guard isValidEmail(email) else {
            errorMessage = "Geçerli bir email adresi girin"
            return
        }
        
        isLoading = true
        
        do {
            // Login request - token is saved by repository
            _ = try await authRepository.login(email: email, password: password)
            
            // Token should be saved by repository, but verify
            guard keychainManager.hasToken() else {
                errorMessage = "Giriş başarısız. Token alınamadı."
                isLoading = false
                return
            }
            
            // Fetch current user
            let user = try await authRepository.getCurrentUser()
            
            // Validate role matches selected role
            let userRole = user.role
            let isUserAdmin = userRole == .admin
            let selectedIsAdmin = selectedRole == .admin
            
            if isUserAdmin && !selectedIsAdmin {
                keychainManager.deleteToken()
                errorMessage = "Bu hesap Admin hesabıdır. Admin bölümünden giriş yapmalısınız."
                isLoading = false
                return
            } else if !isUserAdmin && selectedIsAdmin {
                keychainManager.deleteToken()
                errorMessage = "Bu hesap Personel hesabıdır. Personel bölümünden giriş yapmalısınız."
                isLoading = false
                return
            }
            
            // Success - set user and notify
            currentUser = user
            isAuthenticated = true
            onLoginSuccess?(user)
            
        } catch let error as NetworkError {
            errorMessage = error.errorDescription ?? "Giriş başarısız. Email ve şifrenizi kontrol edin."
        } catch {
            errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin."
        }
        
        isLoading = false
    }
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
}

