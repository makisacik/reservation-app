//
//  Menu.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct Menu: Codable, Identifiable {
    let id: String // UUID
    let restaurantId: String
    let restaurantName: String
    let date: String // ISO date string
    let menuType: String // "Lunch", "Dinner", etc.
    let meals: [Meal]
}

