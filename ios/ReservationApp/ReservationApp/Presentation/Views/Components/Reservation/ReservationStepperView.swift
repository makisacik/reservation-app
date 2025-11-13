//
//  ReservationStepperView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct ReservationStepperView: View {
    let currentStep: Int
    
    private let steps = [
        (number: 1, label: "Tarih"),
        (number: 2, label: "Restoran"),
        (number: 3, label: "Menü Tipi"),
        (number: 4, label: "Menü"),
        (number: 5, label: "Onay")
    ]
    
    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(steps.enumerated()), id: \.element.number) { index, step in
                StepIndicatorView(
                    step: step,
                    isCompleted: step.number < currentStep,
                    isActive: step.number == currentStep,
                    isLast: index == steps.count - 1
                )
            }
        }
    }
}

struct StepIndicatorView: View {
    let step: (number: Int, label: String)
    let isCompleted: Bool
    let isActive: Bool
    let isLast: Bool
    
    var body: some View {
        HStack(spacing: 0) {
            // Step Circle
            ZStack {
                Circle()
                    .fill(isCompleted || isActive ? AppColors.primaryMain : AppColors.borderDefault)
                    .frame(width: 48, height: 48)
                
                if isCompleted {
                    Image(systemName: "checkmark")
                        .foregroundColor(.white)
                        .font(.system(size: 20, weight: .bold))
                } else {
                    Text("\(step.number)")
                        .font(AppTypography.body1())
                        .fontWeight(.semibold)
                        .foregroundColor(isActive ? .white : AppColors.textTertiary)
                }
            }
            
            // Connecting Line
            if !isLast {
                Rectangle()
                    .fill(isCompleted ? AppColors.primaryMain : AppColors.borderDefault)
                    .frame(height: 2)
                    .frame(maxWidth: .infinity)
            }
        }
        .overlay(
            // Label below
            VStack {
                Spacer()
                Text(step.label)
                    .font(AppTypography.caption())
                    .fontWeight(isActive ? .semibold : .regular)
                    .foregroundColor(isCompleted || isActive ? AppColors.primaryMain : AppColors.textTertiary)
                    .offset(y: 30)
            }
        )
    }
}

