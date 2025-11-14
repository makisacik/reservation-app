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
        _ = ThemeManager.shared
        
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
