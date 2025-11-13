//
//  OnboardingViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class OnboardingViewModel: ObservableObject {
    var onGetStarted: (() -> Void)?
    
    func handleGetStarted() {
        onGetStarted?()
    }
}

