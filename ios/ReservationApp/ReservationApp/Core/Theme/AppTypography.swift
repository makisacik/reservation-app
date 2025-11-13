//
//  AppTypography.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct AppTypography {
    // Font weights
    enum FontWeight {
        case regular
        case medium
        case semibold
        case bold
        
        var value: Font.Weight {
            switch self {
            case .regular: return .regular
            case .medium: return .medium
            case .semibold: return .semibold
            case .bold: return .bold
            }
        }
    }
    
    // Font sizes
    enum FontSize: CGFloat {
        case xs = 12
        case sm = 14
        case md = 16
        case lg = 18
        case xl = 20
        case xl2 = 24
        case xl3 = 28
        case xl4 = 32
        case xl5 = 40
    }
    
    // Line heights
    enum LineHeight: CGFloat {
        case tight = 1.2
        case normal = 1.3
        case relaxed = 1.4
        case loose = 1.5
    }
    
    // Typography styles
    static func h1() -> Font {
        return .system(size: 40, weight: .semibold)
    }
    
    static func h2() -> Font {
        return .system(size: 32, weight: .semibold)
    }
    
    static func h3() -> Font {
        return .system(size: 28, weight: .semibold)
    }
    
    static func h4() -> Font {
        return .system(size: 24, weight: .semibold)
    }
    
    static func h5() -> Font {
        return .system(size: 20, weight: .semibold)
    }
    
    static func h6() -> Font {
        return .system(size: 16, weight: .semibold)
    }
    
    static func body1() -> Font {
        return .system(size: 16, weight: .regular)
    }
    
    static func body2() -> Font {
        return .system(size: 14, weight: .regular)
    }
    
    static func button() -> Font {
        return .system(size: 16, weight: .medium)
    }
    
    static func caption() -> Font {
        return .system(size: 12, weight: .regular)
    }
}

