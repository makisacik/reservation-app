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
                MainTabView()
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
    
    private let keychainManager = KeychainManager.shared
    
    private init() {}
    
    func checkAuthState() {
        hasCheckedAuth = true
        isAuthenticated = keychainManager.hasToken()
    }
    
    func setAuthenticated(_ value: Bool) {
        isAuthenticated = value
    }
}

