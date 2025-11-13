//
//  APIEndpoint.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

enum APIEndpoint {
    case login
    case register
    case currentUser
    case allUsers
    case adminUsers
    case homeStats
    case menuCategories
    case meals
    case menus
    case myReservations
    case createReservation
    case restaurants
    case mealTimeSlots
    case updateUserProfile
    
    var path: String {
        switch self {
        case .login:
            return "/auth/login"
        case .register:
            return "/auth/register"
        case .currentUser:
            return "/users/me"
        case .allUsers:
            return "/users"
        case .adminUsers:
            return "/admin/users"
        case .homeStats:
            return "/home/stats"
        case .menuCategories:
            return "/menu-categories"
        case .meals:
            return "/meals"
        case .menus:
            return "/menus"
        case .myReservations:
            return "/reservations/my"
        case .createReservation:
            return "/reservations"
        case .restaurants:
            return "/restaurants"
        case .mealTimeSlots:
            return "/mealtimes"
        case .updateUserProfile:
            return "/users/me"
        }
    }
    
    var method: String {
        switch self {
        case .login, .register, .createReservation:
            return "POST"
        case .updateUserProfile:
            return "PUT"
        case .currentUser, .allUsers, .adminUsers, .homeStats, .menuCategories, .meals, .menus, .myReservations, .restaurants, .mealTimeSlots:
            return "GET"
        }
    }
}

