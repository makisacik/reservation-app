//
//  Step5ConfirmationView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct Step5ConfirmationView: View {
    @ObservedObject var viewModel: MakeReservationViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                Text("Rezervasyon Özeti")
                    .font(AppTypography.h5())
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.textPrimary)
                
                Text("Lütfen bilgilerinizi kontrol edin")
                    .font(AppTypography.body2())
                    .foregroundColor(AppColors.textSecondary)
            }
            
            // Selected Dates
            ConfirmationSection(title: "Seçilen Tarihler:") {
                ForEach(viewModel.selectedDates) { dateObj in
                    DateConfirmationRow(
                        date: dateObj.date,
                        mealTimeSlot: getMealTimeSlot(for: dateObj.mealTimeSlotId)
                    )
                }
            }
            
            // Restaurant
            ConfirmationSection(title: "Restoran:") {
                ConfirmationRow(text: viewModel.selectedRestaurant?.name ?? "")
            }
            
            // Menu Type
            ConfirmationSection(title: "Menü Tipi:") {
                ConfirmationRow(text: viewModel.selectedMenuType?.displayName ?? "")
            }
            
            // Selected Meal
            ConfirmationSection(title: "Seçilen Menü:") {
                ConfirmationRow(text: viewModel.selectedMeal?.name ?? "Menü seçilmedi")
            }
            
            // Appetizer
            if viewModel.appetizer {
                ConfirmationSection(title: "Aparetif Talebi:") {
                    ConfirmationRow(
                        text: "Mevsim meze tabağı",
                        backgroundColor: AppColors.infoMain.opacity(0.1),
                        borderColor: AppColors.infoMain
                    )
                }
            }
            
            // Submit Button
            Button(action: {
                Task {
                    await viewModel.submitReservation()
                }
            }) {
                Text(viewModel.isLoading ? "İşleniyor..." : "Rezervasyonu Onayla")
                    .font(AppTypography.button())
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ThemeManager.shared.spacing.md)
                    .background(viewModel.isLoading ? AppColors.borderDefault : AppColors.primaryMain)
                    .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            }
            .disabled(viewModel.isLoading || !viewModel.canProceedToNextStep())
            .padding(.top, ThemeManager.shared.spacing.lg)
        }
    }
    
    private func getMealTimeSlot(for id: Int?) -> MealTimeSlot? {
        guard let id = id else { return nil }
        return viewModel.mealTimeSlots.first { $0.id == id }
    }
}

struct ConfirmationSection<Content: View>: View {
    let title: String
    let content: Content
    
    init(title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.sm) {
            Text(title)
                .font(AppTypography.body2())
                .fontWeight(.semibold)
                .foregroundColor(AppColors.textSecondary)
            
            content
        }
    }
}

struct DateConfirmationRow: View {
    let date: String
    let mealTimeSlot: MealTimeSlot?
    
    var body: some View {
        HStack {
            Text(formatDateTurkish(date))
                .font(AppTypography.body2())
                .foregroundColor(AppColors.textPrimary)
            
            Spacer()
            
            if let slot = mealTimeSlot {
                Text(slot.turkishName)
                    .font(AppTypography.caption())
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                    .padding(.horizontal, ThemeManager.shared.spacing.sm)
                    .padding(.vertical, ThemeManager.shared.spacing.xs)
                    .background(AppColors.primaryMain)
                    .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            }
        }
        .padding()
        .background(AppColors.warningMain.opacity(0.1))
        .cornerRadius(ThemeManager.shared.borderRadius.button.value)
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

struct ConfirmationRow: View {
    let text: String
    var backgroundColor: Color = AppColors.warningMain.opacity(0.1)
    var borderColor: Color = Color.clear
    
    var body: some View {
        Text(text)
            .font(AppTypography.body2())
            .foregroundColor(AppColors.textPrimary)
            .padding()
            .background(backgroundColor)
            .overlay(
                RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                    .stroke(borderColor, lineWidth: borderColor == Color.clear ? 0 : 2)
            )
            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
    }
}

