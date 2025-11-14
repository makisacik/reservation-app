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
                if let user = authState.currentUser, user.isAdmin {
                    AdminTabView()
                } else if authState.currentUser != nil {
                    MainTabView()
                } else {
                    ProgressView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(AppColors.backgroundPage)
                        .task {
                            if authState.currentUser == nil {
                                await authState.loadCurrentUserIfNeeded()
                            }
                        }
                }
            } else if authState.hasCheckedAuth {
                NavigationStack {
                    OnboardingView()
                }
            } else {
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
            await MainActor.run {
                self.clearUser()
            }
        }
    }
}

