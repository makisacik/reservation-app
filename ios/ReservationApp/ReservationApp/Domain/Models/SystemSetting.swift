//
//  SystemSetting.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct SystemSetting: Codable {
    let key: String
    let value: String
}

struct SettingsUpdate: Codable {
    let settings: [String: String]
}



