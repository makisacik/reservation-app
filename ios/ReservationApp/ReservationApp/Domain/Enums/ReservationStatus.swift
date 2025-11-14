//
//  ReservationStatus.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

enum ReservationStatus: String, Codable {
    case pending = "Pending"
    case active = "Active"
    case cancelled = "Cancelled"
    
    var displayName: String {
        switch self {
        case .pending: return "Beklemede"
        case .active: return "Onaylandı"
        case .cancelled: return "İptal Edildi"
        }
    }
    
    var color: Color {
        switch self {
        case .pending: return AppColors.infoMain
        case .active: return AppColors.primaryMain
        case .cancelled: return AppColors.textSecondary
        }
    }
}



