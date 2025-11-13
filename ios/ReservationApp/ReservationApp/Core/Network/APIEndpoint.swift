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
    
    // Admin Dashboard
    case adminDashboardSummary
    case adminPopularMeals
    case adminTodayReservations
    case adminWeeklyTrends
    case adminDailySummary
    
    // Admin Reservations
    case adminReservations
    case adminApproveReservation(id: String)
    case adminCancelReservation(id: String)
    case reservationSummary
    case getReservationById(id: String)
    
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
        case .adminDashboardSummary:
            return "/admin/dashboard/summary"
        case .adminPopularMeals:
            return "/admin/dashboard/popular-meals"
        case .adminTodayReservations:
            return "/admin/dashboard/today-reservations"
        case .adminWeeklyTrends:
            return "/admin/dashboard/weekly"
        case .adminDailySummary:
            return "/admin/dashboard/daily-summary"
        case .adminReservations:
            return "/admin/reservations"
        case .adminApproveReservation(let id):
            return "/admin/reservations/\(id)/approve"
        case .adminCancelReservation(let id):
            return "/admin/reservations/\(id)/cancel"
        case .reservationSummary:
            return "/admin/reservations/summary"
        case .getReservationById(let id):
            return "/reservations/\(id)"
        }
    }
    
    var method: String {
        switch self {
        case .login, .register, .createReservation:
            return "POST"
        case .updateUserProfile, .adminApproveReservation, .adminCancelReservation:
            return "PUT"
        case .currentUser, .allUsers, .adminUsers, .homeStats, .menuCategories, .meals, .menus, .myReservations, .restaurants, .mealTimeSlots, .adminDashboardSummary, .adminPopularMeals, .adminTodayReservations, .adminWeeklyTrends, .adminDailySummary, .adminReservations, .reservationSummary, .getReservationById:
            return "GET"
        }
    }
}

