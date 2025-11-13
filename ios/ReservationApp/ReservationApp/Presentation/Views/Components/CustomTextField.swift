//
//  CustomTextField.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct CustomTextField: View {
    let placeholder: String
    @Binding var text: String
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    
    var body: some View {
        Group {
            if isSecure {
                SecureField(placeholder, text: $text)
            } else {
                TextField(placeholder, text: $text)
                    .keyboardType(keyboardType)
                    .autocapitalization(.none)
                    .autocorrectionDisabled()
            }
        }
        .padding()
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.BorderRadius.input.value)
        .overlay(
            RoundedRectangle(cornerRadius: ThemeManager.BorderRadius.input.value)
                .stroke(AppColors.borderDefault, lineWidth: 1)
        )
    }
}

