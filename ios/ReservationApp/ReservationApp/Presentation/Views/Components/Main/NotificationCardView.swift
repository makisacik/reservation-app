//
//  NotificationCardView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct NotificationCardView: View {
    let alertMessage: AlertMessage?
    
    var body: some View {
        if let alert = alertMessage {
            AlertBannerView(
                title: alert.title,
                message: alert.message
            )
            .frame(maxWidth: .infinity)
            .shadow(
                color: Color.black.opacity(0.1),
                radius: 4,
                x: 0,
                y: 2
            )
        }
    }
}

