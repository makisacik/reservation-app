//
//  AppShadows.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AppShadows {
    // Card shadows
    static let card = Shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 4)
    static let cardHover = Shadow(color: Color.black.opacity(0.10), radius: 10, x: 0, y: 8)
    static let cardElevated = Shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 4)
    
    // Button shadows
    static let button = Shadow(color: Color.black.opacity(0.08), radius: 4, x: 0, y: 2)
    static let buttonHover = Shadow(color: Color(hex: "#0A1445").opacity(0.25), radius: 6, x: 0, y: 4)
    static let buttonActive = Shadow(color: Color(hex: "#0A1445").opacity(0.35), radius: 8, x: 0, y: 6)
    
    // Input/Field shadows
    static let input = Shadow(color: Color.black.opacity(0.08), radius: 4, x: 0, y: 2)
    static let inputHover = Shadow(color: Color.black.opacity(0.12), radius: 8, x: 0, y: 4)
    
    // Icon shadows
    static let icon = Shadow(color: Color(hex: "#6B2C91").opacity(0.3), radius: 4, x: 0, y: 2)
    
    // Modal/Dialog shadows
    static let modal = Shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 4)
    
    // Onboarding card shadows
    static let onboardingCard = Shadow(color: Color.black.opacity(0.08), radius: 4, x: 0, y: 2)
    static let onboardingCardHover = Shadow(color: Color.black.opacity(0.12), radius: 8, x: 0, y: 4)
}

struct Shadow {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

extension View {
    func appShadow(_ shadow: Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }
}

