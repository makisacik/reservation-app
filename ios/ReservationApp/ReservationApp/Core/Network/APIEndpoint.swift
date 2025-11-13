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
    
    // Admin Meals
    case adminMeals
    case adminMeal(id: String)
    case adminCreateMeal
    case adminUpdateMeal(id: String)
    case adminDeleteMeal(id: String)
    
    // Admin Users
    case adminUserStatistics
    case adminCreateUser
    case adminUpdateUser(id: String)
    case adminDeleteUser(id: String)
    
    // Admin Settings
    case adminGeneralSettings
    case adminUpdateGeneralSettings
    case adminReservationSettings
    case adminUpdateReservationSettings
    case adminNotificationSettings
    case adminUpdateNotificationSettings
    
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
        case .adminMeals:
            return "/admin/meals"
        case .adminMeal(let id):
            return "/admin/meals/\(id)"
        case .adminCreateMeal:
            return "/admin/meals"
        case .adminUpdateMeal(let id):
            return "/admin/meals/\(id)"
        case .adminDeleteMeal(let id):
            return "/admin/meals/\(id)"
        case .adminUserStatistics:
            return "/admin/users/statistics"
        case .adminCreateUser:
            return "/admin/users"
        case .adminUpdateUser(let id):
            return "/admin/users/\(id)"
        case .adminDeleteUser(let id):
            return "/admin/users/\(id)"
        case .adminGeneralSettings, .adminUpdateGeneralSettings:
            return "/admin/settings/general"
        case .adminReservationSettings, .adminUpdateReservationSettings:
            return "/admin/settings/reservation"
        case .adminNotificationSettings, .adminUpdateNotificationSettings:
            return "/admin/settings/notifications"
        }
    }
    
    var method: String {
        switch self {
        case .login, .register, .createReservation, .adminCreateMeal, .adminCreateUser:
            return "POST"
        case .updateUserProfile, .adminApproveReservation, .adminCancelReservation, .adminUpdateMeal, .adminUpdateUser, .adminUpdateGeneralSettings, .adminUpdateReservationSettings, .adminUpdateNotificationSettings:
            return "PUT"
        case .adminDeleteMeal, .adminDeleteUser:
            return "DELETE"
        case .currentUser, .allUsers, .adminUsers, .homeStats, .menuCategories, .meals, .menus, .myReservations, .restaurants, .mealTimeSlots, .adminDashboardSummary, .adminPopularMeals, .adminTodayReservations, .adminWeeklyTrends, .adminDailySummary, .adminReservations, .reservationSummary, .getReservationById, .adminMeals, .adminMeal, .adminUserStatistics, .adminGeneralSettings, .adminReservationSettings, .adminNotificationSettings:
            return "GET"
        }
    }
}

