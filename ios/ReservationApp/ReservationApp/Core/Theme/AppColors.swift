//
//  AppColors.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AppColors {
    // Primary colors
    static let primaryMain = Color(hex: "#0A1C59")
    static let primaryLight = Color(hex: "#1665d8")
    static let primaryDark = Color(hex: "#0d2569")
    static let primaryDarker = Color(hex: "#0d2a7a")
    static let primaryContrastText = Color.white
    
    // Secondary colors
    static let secondaryMain = Color(hex: "#dc004e")
    static let secondaryLight = Color(hex: "#ff5983")
    static let secondaryDark = Color(hex: "#9a0036")
    static let secondaryContrastText = Color.white
    
    // Status colors
    static let successMain = Color(hex: "#4caf50")
    static let successLight = Color(hex: "#10b981")
    static let errorMain = Color(hex: "#e53935")
    static let warningMain = Color(hex: "#fb8c00")
    static let infoMain = Color(hex: "#1976d2")
    static let infoLight = Color(hex: "#4A90E2")
    
    // Background colors
    static let backgroundDefault = Color(hex: "#f5f5f5")
    static let backgroundPaper = Color.white
    static let backgroundPage = Color(hex: "#F6F7FB")
    static let backgroundLight = Color(hex: "#F5F5F5")
    static let backgroundLighter = Color(hex: "#F0F0F0")
    static let backgroundBeige = Color(hex: "#F5E6D3")
    static let backgroundTan = Color(hex: "#F5F2EF")
    static let backgroundActiveTab = Color(hex: "#F5F2EF")
    static let backgroundInactiveTab = Color(hex: "#F8F9FA")
    static let backgroundErrorLight = Color(hex: "#ffebee")
    
    // Text colors
    static let textPrimary = Color(hex: "#333")
    static let textSecondary = Color(hex: "#666")
    static let textTertiary = Color(hex: "#9E9E9E")
    static let textQuaternary = Color(hex: "#999")
    static let textDisabled = Color(hex: "#E0E0E0")
    static let textWhite = Color.white
    
    // Border colors
    static let borderDefault = Color(hex: "#E0E0E0")
    static let borderLight = Color(hex: "#E0E0E0")
    static let borderDark = Color(hex: "#9E9E9E")
    
    // Onboarding colors
    static let onboardingPrimary = Color(hex: "#0A1445")
    static let onboardingPrimaryDark = Color(hex: "#091234")
    
    // Gradient colors (for use in LinearGradient)
    static let gradientPrimaryStart = Color(hex: "#FF6B35")
    static let gradientPrimaryEnd = Color(hex: "#C94B4B")
    static let gradientPurpleStart = Color(hex: "#9C27B0")
    static let gradientPurpleEnd = Color(hex: "#7B1FA2")
    static let gradientBlueStart = Color(hex: "#03A9F4")
    static let gradientBlueEnd = Color(hex: "#0288D1")
    static let gradientCyanStart = Color(hex: "#00BCD4")
    static let gradientCyanEnd = Color(hex: "#0097A7")
    static let gradientLoginIconStart = Color(hex: "#6B2C91")
    static let gradientLoginIconMiddle = Color(hex: "#C94B4B")
    static let gradientLoginIconEnd = Color(hex: "#FF6B35")
}

// Extension to create Color from hex string
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

