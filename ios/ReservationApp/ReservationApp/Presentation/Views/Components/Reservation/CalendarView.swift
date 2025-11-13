//
//  CalendarView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct CalendarView: View {
    @Binding var selectedDates: [SelectedDate]
    let maxSelections: Int
    
    @State private var currentMonth: Date = Date()
    
    private let turkishMonths = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ]
    
    private let dayHeaders = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            // Month Navigation
            HStack {
                Button(action: previousMonth) {
                    Image(systemName: "chevron.left")
                        .foregroundColor(AppColors.textPrimary)
                }
                
                Spacer()
                
                Text(monthYearString)
                    .font(AppTypography.h6())
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.textPrimary)
                
                Spacer()
                
                Button(action: nextMonth) {
                    Image(systemName: "chevron.right")
                        .foregroundColor(AppColors.textPrimary)
                }
            }
            .padding(.horizontal, ThemeManager.shared.spacing.md)
            
            // Day Headers
            HStack(spacing: 0) {
                ForEach(dayHeaders, id: \.self) { day in
                    Text(day)
                        .font(AppTypography.caption())
                        .foregroundColor(AppColors.textSecondary)
                        .frame(maxWidth: .infinity)
                }
            }
            
            // Calendar Grid
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: ThemeManager.shared.spacing.xs) {
                ForEach(calendarDays, id: \.self) { day in
                    CalendarDayView(
                        day: day,
                        isSelected: isDateSelected(day),
                        isToday: isToday(day),
                        isPast: isPast(day),
                        onTap: {
                            handleDateTap(day)
                        }
                    )
                }
            }
        }
    }
    
    private var monthYearString: String {
        let calendar = Calendar.current
        let month = calendar.component(.month, from: currentMonth) - 1
        let year = calendar.component(.year, from: currentMonth)
        return "\(turkishMonths[month]) \(year)"
    }
    
    private var calendarDays: [Date] {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month], from: currentMonth)
        guard let firstOfMonth = calendar.date(from: components),
              let range = calendar.range(of: .day, in: .month, for: firstOfMonth) else {
            return []
        }
        
        let firstWeekday = calendar.component(.weekday, from: firstOfMonth)
        let adjustedFirstWeekday = (firstWeekday + 5) % 7 // Convert to Monday = 0
        
        var days: [Date] = []
        
        // Previous month days
        if adjustedFirstWeekday > 0 {
            let prevMonth = calendar.date(byAdding: .month, value: -1, to: firstOfMonth)!
            let daysInPrevMonth = calendar.range(of: .day, in: .month, for: prevMonth)!.count
            for i in (daysInPrevMonth - adjustedFirstWeekday + 1)...daysInPrevMonth {
                if let date = calendar.date(byAdding: .day, value: i - daysInPrevMonth, to: prevMonth) {
                    days.append(date)
                }
            }
        }
        
        // Current month days
        for day in range {
            if let date = calendar.date(byAdding: .day, value: day - 1, to: firstOfMonth) {
                days.append(date)
            }
        }
        
        // Next month days to fill grid
        let remaining = 42 - days.count
        if remaining > 0 {
            let nextMonth = calendar.date(byAdding: .month, value: 1, to: firstOfMonth)!
            for day in 1...remaining {
                if let date = calendar.date(byAdding: .day, value: day - 1, to: nextMonth) {
                    days.append(date)
                }
            }
        }
        
        return days
    }
    
    private func isDateSelected(_ date: Date) -> Bool {
        let dateString = formatDate(date)
        return selectedDates.contains { $0.date == dateString }
    }
    
    private func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }
    
    private func isPast(_ date: Date) -> Bool {
        date < Calendar.current.startOfDay(for: Date())
    }
    
    private func handleDateTap(_ date: Date) {
        guard !isPast(date) else { return }
        
        let dateString = formatDate(date)
        
        if let index = selectedDates.firstIndex(where: { $0.date == dateString }) {
            selectedDates.remove(at: index)
        } else {
            if selectedDates.count < maxSelections {
                selectedDates.append(SelectedDate(date: dateString, mealTimeSlotId: nil))
            }
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }
    
    private func previousMonth() {
        currentMonth = Calendar.current.date(byAdding: .month, value: -1, to: currentMonth) ?? currentMonth
    }
    
    private func nextMonth() {
        currentMonth = Calendar.current.date(byAdding: .month, value: 1, to: currentMonth) ?? currentMonth
    }
}

struct CalendarDayView: View {
    let day: Date
    let isSelected: Bool
    let isToday: Bool
    let isPast: Bool
    let onTap: () -> Void
    
    private var dayNumber: Int {
        Calendar.current.component(.day, from: day)
    }
    
    var body: some View {
        Button(action: onTap) {
            Text("\(dayNumber)")
                .font(AppTypography.body2())
                .fontWeight(isToday ? .semibold : .regular)
                .foregroundColor(dayColor)
                .frame(width: 40, height: 40)
                .background(backgroundColor)
                .clipShape(Circle())
                .overlay(
                    Circle()
                        .stroke(isToday && !isSelected ? AppColors.primaryMain : Color.clear, lineWidth: 2)
                )
        }
        .disabled(isPast)
        .buttonStyle(PlainButtonStyle())
    }
    
    private var dayColor: Color {
        if isPast {
            return AppColors.textDisabled
        } else if isSelected {
            return .white
        } else if isToday {
            return AppColors.primaryMain
        } else {
            return AppColors.textPrimary
        }
    }
    
    private var backgroundColor: Color {
        if isSelected {
            return isToday ? AppColors.primaryMain : AppColors.primaryLight
        } else {
            return Color.clear
        }
    }
}

