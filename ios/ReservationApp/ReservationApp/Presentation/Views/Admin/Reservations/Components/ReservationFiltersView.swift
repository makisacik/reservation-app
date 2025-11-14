//
//  ReservationFiltersView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationFiltersView: View {
    @ObservedObject var viewModel: AdminReservationsViewModel
    
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            // Search Bar
            HStack(spacing: ThemeManager.shared.spacing.sm) {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(AppColors.textTertiary)
                
                TextField(
                    "İsim, rezervasyon no veya menü ara...",
                    text: $viewModel.searchQuery
                )
                .textFieldStyle(PlainTextFieldStyle())
                .font(AppTypography.body1())
                .onSubmit {
                    viewModel.applyFilters()
                }
            }
            .padding(ThemeManager.shared.spacing.md)
            .background(AppColors.backgroundPaper)
            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            .overlay(
                RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                    .stroke(AppColors.borderDefault, lineWidth: 1)
            )
            
            // Date Range and Status Filter
            HStack(spacing: ThemeManager.shared.spacing.sm) {
                // Date From
                DatePicker(
                    "Başlangıç",
                    selection: Binding(
                        get: { viewModel.dateFrom ?? Date() },
                        set: { viewModel.dateFrom = $0 }
                    ),
                    displayedComponents: .date
                )
                .datePickerStyle(.compact)
                .labelsHidden()
                
                // Date To
                DatePicker(
                    "Bitiş",
                    selection: Binding(
                        get: { viewModel.dateTo ?? Date() },
                        set: { viewModel.dateTo = $0 }
                    ),
                    displayedComponents: .date
                )
                .datePickerStyle(.compact)
                .labelsHidden()
                
                // Status Filter
                Picker("Durum", selection: $viewModel.statusFilter) {
                    ForEach(ReservationStatusFilter.allCases, id: \.self) { filter in
                        Text(filter.displayName).tag(filter)
                    }
                }
                .pickerStyle(.menu)
            }
            
            // Apply Filters Button
            Button(action: {
                viewModel.applyFilters()
            }) {
                Text("Filtrele")
                    .font(AppTypography.button())
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, ThemeManager.shared.spacing.sm)
                    .background(AppColors.primaryMain)
                    .cornerRadius(ThemeManager.shared.borderRadius.button.value)
            }
        }
        .padding(ThemeManager.shared.spacing.md)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}



