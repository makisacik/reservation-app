//
//  AdminTabView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AdminTabView: View {
    var body: some View {
        TabView {
            AdminDashboardView()
                .tabItem {
                    Label("Dashboard", systemImage: "chart.bar.fill")
                }
            
            AdminReservationsView()
                .tabItem {
                    Label("Rezervasyonlar", systemImage: "calendar")
                }
            
            MenuManagementView()
                .tabItem {
                    Label("Menüler", systemImage: "fork.knife")
                }
            
            UsersManagementView()
                .tabItem {
                    Label("Kullanıcılar", systemImage: "person.2.fill")
                }
            
            SettingsView()
                .tabItem {
                    Label("Ayarlar", systemImage: "gearshape.fill")
                }
        }
        .accentColor(AppColors.primaryMain)
    }
}

// Placeholder views for other tabs (to be implemented in later phases)

struct SettingsView: View {
    var body: some View {
        VStack {
            Text("Settings")
                .font(AppTypography.h4())
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(AppColors.backgroundPage)
    }
}

