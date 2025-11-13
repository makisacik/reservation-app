//
//  RootView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI
import Combine

struct RootView: View {
    @StateObject private var authState = AuthStateManager.shared
    
    var body: some View {
        Group {
            if authState.isAuthenticated {
                // Check if user is admin
                if let user = authState.currentUser, user.isAdmin {
                    AdminTabView()
                } else if authState.currentUser != nil {
                    // User is loaded and not admin
                    MainTabView() // User panel
                } else {
                    // User is authenticated but not loaded yet - show loading
                    ProgressView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(AppColors.backgroundPage)
                        .task {
                            // AuthStateManager will load the user automatically
                            // But we can trigger it here if needed
                            if authState.currentUser == nil {
                                await authState.loadCurrentUserIfNeeded()
                            }
                        }
                }
            } else if authState.hasCheckedAuth {
                // Show onboarding if no token
                NavigationStack {
                    OnboardingView()
                }
            } else {
                // Loading state
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(AppColors.backgroundPage)
            }
        }
        .onAppear {
            authState.checkAuthState()
        }
    }
}

// Auth state manager to check if user is authenticated
class AuthStateManager: ObservableObject {
    static let shared = AuthStateManager()
    
    @Published var isAuthenticated: Bool = false
    @Published var hasCheckedAuth: Bool = false
    @Published var currentUser: User?
    
    private let keychainManager = KeychainManager.shared
    
    private init() {}
    
    func checkAuthState() {
        hasCheckedAuth = true
        isAuthenticated = keychainManager.hasToken()
        
        // If authenticated but no user, try to load it
        if isAuthenticated && currentUser == nil {
            Task {
                await loadCurrentUser()
            }
        }
    }
    
    func setAuthenticated(_ value: Bool) {
        isAuthenticated = value
    }
    
    func setCurrentUser(_ user: User) {
        currentUser = user
        isAuthenticated = true
    }
    
    func clearUser() {
        currentUser = nil
        isAuthenticated = false
    }
    
    func loadCurrentUserIfNeeded() async {
        guard isAuthenticated && currentUser == nil else { return }
        await loadCurrentUser()
    }
    
    private func loadCurrentUser() async {
        guard isAuthenticated else { return }
        
        do {
            let authRepository = AuthRepository()
            let user = try await authRepository.getCurrentUser()
            await MainActor.run {
                self.currentUser = user
            }
        } catch {
            // If loading fails, clear auth state
            await MainActor.run {
                self.clearUser()
            }
        }
    }
}

