//
//  Step1DateSelectionView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct Step1DateSelectionView: View {
    @ObservedObject var viewModel: MakeReservationViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                HStack(spacing: ThemeManager.shared.spacing.sm) {
                    Image(systemName: "calendar")
                        .foregroundColor(AppColors.primaryMain)
                        .font(.system(size: 28))
                    
                    Text("Tarih & Öğün Seçimi (Maksimum 2 Gün)")
                        .font(AppTypography.h5())
                        .fontWeight(.semibold)
                        .foregroundColor(AppColors.textPrimary)
                }
                
                Text("Haftalık menü için istediğiniz günleri seçin")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
                    .padding(.leading, 40)
            }
            
            // Calendar
            CalendarView(
                selectedDates: $viewModel.selectedDates,
                maxSelections: viewModel.maxDateSelections
            )
            .padding()
            .background(AppColors.backgroundPaper)
            .cornerRadius(ThemeManager.shared.borderRadius.card.value)
            .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
            
            // Meal Time Slot Selection
            if !viewModel.selectedDates.isEmpty {
                MealTimeSlotSelectionView(
                    selectedDates: $viewModel.selectedDates,
                    mealTimeSlots: viewModel.mealTimeSlots,
                    onSlotSelected: { date, slotId in
                        viewModel.selectMealTimeSlot(for: date, slotId: slotId)
                    }
                )
            }
        }
    }
}

struct MealTimeSlotSelectionView: View {
    @Binding var selectedDates: [SelectedDate]
    let mealTimeSlots: [MealTimeSlot]
    let onSlotSelected: (String, Int) -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
            Text("Seçilen Günler için Öğün Seçin")
                .font(AppTypography.h6())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textPrimary)
            
            ForEach(selectedDates) { dateObj in
                VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.sm) {
                    HStack {
                        Text(formatDateTurkish(dateObj.date))
                            .font(AppTypography.body1())
                            .fontWeight(.medium)
                        
                        if let index = selectedDates.firstIndex(where: { $0.id == dateObj.id }) {
                            Text("\(index + 1). Gün")
                                .font(AppTypography.caption())
                                .foregroundColor(.white)
                                .padding(.horizontal, ThemeManager.shared.spacing.sm)
                                .padding(.vertical, ThemeManager.shared.spacing.xs)
                                .background(AppColors.primaryMain)
                                .cornerRadius(ThemeManager.shared.borderRadius.card.value)
                        }
                    }
                    
                    ForEach(mealTimeSlots) { slot in
                        MealTimeSlotOption(
                            slot: slot,
                            isSelected: dateObj.mealTimeSlotId == slot.id,
                            onSelect: {
                                onSlotSelected(dateObj.date, slot.id)
                            }
                        )
                    }
                }
                .padding()
                .background(AppColors.warningMain.opacity(0.1))
                .cornerRadius(ThemeManager.shared.borderRadius.card.value)
            }
        }
        .padding()
        .background(AppColors.warningMain.opacity(0.1))
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
    }
    
    private func formatDateTurkish(_ dateString: String) -> String {
        // Format as "4 Kasım Pazartesi"
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let date = formatter.date(from: dateString) else {
            return dateString
        }
        
        let turkishMonths = [
            "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
        ]
        
        let turkishDays = [
            "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
        ]
        
        let calendar = Calendar.current
        let day = calendar.component(.day, from: date)
        let month = calendar.component(.month, from: date) - 1
        let weekday = calendar.component(.weekday, from: date) - 1
        
        return "\(day) \(turkishMonths[month]) \(turkishDays[weekday])"
    }
}

struct MealTimeSlotOption: View {
    let slot: MealTimeSlot
    let isSelected: Bool
    let onSelect: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            HStack {
                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isSelected ? AppColors.primaryMain : AppColors.textSecondary)
                
                Text("\(slot.turkishName) (\(slot.formattedTimeRange))")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textPrimary)
                
                Spacer()
            }
            .padding()
            .background(AppColors.backgroundPaper)
            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

