//
//  HomeRepositoryProtocol.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

protocol HomeRepositoryProtocol {
    func getHomeStats() async throws -> HomePageStats
    func getCategories() async throws -> [MenuCategory]
    func getMeals(restaurantId: String?, categoryId: String?) async throws -> [Meal]
    func getTodayMenu() async throws -> [Menu]
}

