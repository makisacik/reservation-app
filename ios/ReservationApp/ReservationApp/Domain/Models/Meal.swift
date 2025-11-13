//
//  Meal.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct Meal: Codable, Identifiable {
    let id: String // UUID
    let name: String
    let description: String?
    let kcal: Int?
    let price: Double?
    let categoryId: String
    let categoryName: String
    let restaurantId: String
    let restaurantName: String
    let imageUrl: String?
}

