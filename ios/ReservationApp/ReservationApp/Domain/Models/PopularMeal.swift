//
//  PopularMeal.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct PopularMeal: Codable, Identifiable {
    let mealId: String
    let mealName: String
    let reservationCount: Int
    
    var id: String { mealId }
}



