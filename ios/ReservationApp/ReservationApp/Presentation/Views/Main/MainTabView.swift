//
//  MainTabView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            PersonalPanelView()
                .tabItem {
                    Label("Ana Sayfa", systemImage: "house.fill")
                }
            
            ReservationsView()
                .tabItem {
                    Label("Rezervasyonlar", systemImage: "calendar")
                }
            
            ProfileView()
                .tabItem {
                    Label("Profil", systemImage: "person.fill")
                }
        }
        .accentColor(AppColors.primaryMain)
    }
}

