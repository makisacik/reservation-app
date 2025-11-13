//
//  Restaurant.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct Restaurant: Codable, Identifiable {
    let id: String // UUID
    let name: String
    let description: String?
}

