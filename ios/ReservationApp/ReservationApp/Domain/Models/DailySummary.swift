//
//  DailySummary.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import Combine

struct DailySummary: Codable, Identifiable {
    let dayAbbreviation: String
    let reservationCount: Int
    
    var id: String { dayAbbreviation }
}

