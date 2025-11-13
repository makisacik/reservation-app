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
                    Label("Panel", systemImage: "chart.bar.fill")
                }
            
            AdminReservationsView()
                .tabItem {
                    Label("Rezervasyon", systemImage: "calendar")
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
