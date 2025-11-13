//
//  UserStatistics.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct UserStatistics: Codable {
    let totalUsers: Int
    let activeUsers: Int
    let passiveUsers: Int
    let newThisMonth: Int
}

