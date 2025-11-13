//
//  SettingsRepositoryProtocol.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

protocol SettingsRepositoryProtocol {
    func getGeneralSettings() async throws -> [String: String]
    func updateGeneralSettings(_ settings: [String: String]) async throws -> [String: String]
    
    func getReservationSettings() async throws -> [String: String]
    func updateReservationSettings(_ settings: [String: String]) async throws -> [String: String]
    
    func getNotificationSettings() async throws -> [String: String]
    func updateNotificationSettings(_ settings: [String: String]) async throws -> [String: String]
}

