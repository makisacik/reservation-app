//
//  Reservation.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct Reservation: Codable, Identifiable {
    let id: String // UUID
    let reservationNumber: String
    let userId: String
    let userName: String
    let restaurantId: String
    let restaurantName: String
    let menuId: String
    let menuName: String
    let menuDate: String // ISO date string
    let mealTimeSlotId: Int
    let mealTimeSlotName: String
    let date: String // ISO date string
    let appetizer: Bool
    let status: String // "Pending", "Active", "Cancelled"
    let createdAt: String // ISO date string
    let updatedAt: String? // ISO date string
}



