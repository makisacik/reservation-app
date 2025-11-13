//
//  DashboardSummary.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct DashboardSummary: Codable {
    let totalReservations: Int
    let totalReservationsChangePercent: Double
    let activeUsers: Int
    let activeUsersChangePercent: Double
    let todayMeals: Int
    let todayMealsChangePercent: Double
    let monthlyCost: Double
    let monthlyCostChangePercent: Double
    // Legacy fields
    let totalUsers: Int
    let totalMeals: Int
    let totalRestaurants: Int
}

