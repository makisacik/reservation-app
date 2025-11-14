//
//  WeeklyTrend.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct WeeklyTrend: Codable, Identifiable {
    let weekStart: String // ISO date
    let weekEnd: String // ISO date
    let reservationCount: Int
    
    var id: String { weekStart }
}



