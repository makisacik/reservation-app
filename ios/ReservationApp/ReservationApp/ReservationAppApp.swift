//
//  ReservationAppApp.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

@main
struct ReservationAppApp: App {
    init() {
        // Initialize theme manager
        _ = ThemeManager.shared
        
        // Configure API client unauthorized handler
        APIClient.shared.onUnauthorized = {
            Task { @MainActor in
                AuthStateManager.shared.setAuthenticated(false)
            }
        }
    }
    
    var body: some Scene {
        WindowGroup {
            RootView()
        }
    }
}
