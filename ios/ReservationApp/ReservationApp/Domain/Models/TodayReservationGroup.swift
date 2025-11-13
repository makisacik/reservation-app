//
//  TodayReservationGroup.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct TodayReservationGroup: Codable, Identifiable {
    let mealTimeSlotName: String
    let startTime: String // Time format
    let endTime: String // Time format
    let restaurantName: String
    let reservationCount: Int
    
    var id: String { "\(mealTimeSlotName)-\(restaurantName)" }
}

