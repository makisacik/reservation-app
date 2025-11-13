//
//  MealTimeSlot.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

struct MealTimeSlot: Codable, Identifiable {
    let id: Int
    let name: String
    let startTime: String // Time format from backend
    let endTime: String // Time format from backend
    
    // Computed properties for display
    var turkishName: String {
        // Map English names to Turkish
        switch name.lowercased() {
        case "breakfast": return "Kahvaltı"
        case "lunch": return "Öğle Yemeği"
        case "dinner": return "Akşam Yemeği"
        default: return name
        }
    }
    
    var formattedTimeRange: String {
        // Format time range (e.g., "12:00 - 14:00")
        // Parse startTime and endTime strings and format
        return "\(formatTime(startTime)) - \(formatTime(endTime))"
    }
    
    private func formatTime(_ timeString: String) -> String {
        // Parse and format time string
        // Backend sends TimeOnly as string, parse it
        // This is a simplified version - adjust based on actual format
        // TODO: Implement proper time parsing and formatting for Turkish locale
        return timeString
    }
}

