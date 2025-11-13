//
//  ProfileViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class ProfileViewModel: ObservableObject {
    @Published var user: User?
    @Published var isLoading = false
    @Published var isSaving = false
    @Published var errorMessage: String?
    @Published var successMessage: String?
    
    // Form data
    @Published var name: String = ""
    @Published var email: String = ""
    @Published var department: String = ""
    
    private let authRepository: AuthRepositoryProtocol
    private let keychainManager: KeychainManager
    private let authStateManager: AuthStateManager
    
    init(
        authRepository: AuthRepositoryProtocol = AuthRepository(),
        keychainManager: KeychainManager = KeychainManager.shared,
        authStateManager: AuthStateManager = AuthStateManager.shared
    ) {
        self.authRepository = authRepository
        self.keychainManager = keychainManager
        self.authStateManager = authStateManager
    }
    
    func loadProfile() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let userData = try await authRepository.getCurrentUser()
            self.user = userData
            self.name = userData.name
            self.email = userData.email
            self.department = userData.department ?? ""
        } catch {
            errorMessage = "Profil bilgileri yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func saveProfile() async {
        guard !name.trimmingCharacters(in: .whitespaces).isEmpty else {
            errorMessage = "Ad alanı zorunludur."
            return
        }
        
        isSaving = true
        errorMessage = nil
        successMessage = nil
        
        do {
            let request = UpdateUserProfileRequest(name: name, department: department.isEmpty ? nil : department)
            let updatedUser = try await authRepository.updateUserProfile(request: request)
            self.user = updatedUser
            self.name = updatedUser.name
            self.email = updatedUser.email
            self.department = updatedUser.department ?? ""
            successMessage = "Profil başarıyla güncellendi"
        } catch {
            errorMessage = "Profil kaydedilirken bir hata oluştu."
        }
        
        isSaving = false
    }
    
    func logout() {
        // Delete token from keychain (following frontend pattern - no API call needed)
        keychainManager.deleteToken()
        
        // Clear user data
        self.user = nil
        self.name = ""
        self.email = ""
        self.department = ""
        
        // Update authentication state - this will trigger RootView to show OnboardingView
        authStateManager.setAuthenticated(false)
    }
}

