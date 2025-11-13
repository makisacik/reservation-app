//
//  MenuType.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI

enum MenuType: Int, Codable {
    case standard = 1
    case special = 2
    
    var displayName: String {
        switch self {
        case .standard: return "Standart Menü"
        case .special: return "Özel Menü"
        }
    }
    
    var color: Color {
        switch self {
        case .standard: return AppColors.infoMain
        case .special: return AppColors.secondaryMain
        }
    }
}

