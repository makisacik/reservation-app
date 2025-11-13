//
//  ThemeManager.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI
import Combine

class ThemeManager: ObservableObject {
    static let shared = ThemeManager()
    
    // Colors
    let colors = AppColors.self
    
    // Typography
    let typography = AppTypography.self
    
    // Spacing
    let spacing = AppSpacing.self
    
    // Shadows
    let shadows = AppShadows.self
    
    // Border radius
    enum BorderRadius {
        case small
        case medium
        case large
        case xlarge
        case pill
        case circular
        
        // Component-specific
        case card
        case button
        case input
        case chip
        
        // Computed property to get the actual value
        var value: CGFloat {
            switch self {
            case .small:
                return 4
            case .medium:
                return 8
            case .large:
                return 12
            case .xlarge:
                return 20
            case .pill:
                return 25
            case .circular:
                return 50
            case .card:
                return 20
            case .button:
                return 12
            case .input:
                return 12
            case .chip:
                return 8
            }
        }
    }
    
    // Border radius accessor
    let borderRadius = BorderRadius.self
    
    private init() {}
}

// Extension for easy access
extension View {
    var theme: ThemeManager {
        ThemeManager.shared
    }
}

