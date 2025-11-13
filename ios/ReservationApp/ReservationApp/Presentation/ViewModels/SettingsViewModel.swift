//
//  SettingsViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class SettingsViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var isSaving = false
    @Published var errorMessage: String?
    @Published var successMessage: String?
    
    // General Settings
    @Published var companyName: String = ""
    @Published var timezone: String = "Europe/Istanbul"
    
    // Reservation Settings
    @Published var maxAdvanceReservationDays: String = "30"
    @Published var minCancellationHours: String = "24"
    @Published var autoApproval: Bool = false
    
    // Notification Settings
    @Published var emailEnabled: Bool = false
    
    private let settingsRepository: SettingsRepositoryProtocol
    private let keychainManager: KeychainManager
    private let authStateManager: AuthStateManager
    
    init(
        settingsRepository: SettingsRepositoryProtocol = SettingsRepository(),
        keychainManager: KeychainManager = KeychainManager.shared
    ) {
        self.settingsRepository = settingsRepository
        self.keychainManager = keychainManager
        self.authStateManager = AuthStateManager.shared
    }
    
    func loadSettings() async {
        isLoading = true
        errorMessage = nil
        
        async let generalTask = settingsRepository.getGeneralSettings()
        async let reservationTask = settingsRepository.getReservationSettings()
        async let notificationTask = settingsRepository.getNotificationSettings()
        
        do {
            let (general, reservation, notification) =
                try await (generalTask, reservationTask, notificationTask)
            
            // General Settings
            companyName = general["CompanyName"] ?? ""
            timezone = general["Timezone"] ?? "Europe/Istanbul"
            
            // Reservation Settings
            maxAdvanceReservationDays = reservation["MaxAdvanceReservationDays"] ?? "30"
            minCancellationHours = reservation["CancellationNoticeHours"] ?? "24"
            autoApproval = reservation["AutoApproval"] == "true" || reservation["AutoApproval"] == "True"
            
            // Notification Settings
            emailEnabled = notification["EmailEnabled"] == "true" || notification["EmailEnabled"] == "True"
        } catch {
            errorMessage = "Ayarlar yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func saveGeneralSettings() async {
        isSaving = true
        errorMessage = nil
        successMessage = nil
        
        let settings: [String: String] = [
            "CompanyName": companyName,
            "Timezone": timezone
        ]
        
        do {
            let updated = try await settingsRepository.updateGeneralSettings(settings)
            companyName = updated["CompanyName"] ?? ""
            timezone = updated["Timezone"] ?? "Europe/Istanbul"
            successMessage = "Genel ayarlar başarıyla kaydedildi"
        } catch {
            errorMessage = "Ayarlar kaydedilirken bir hata oluştu."
        }
        
        isSaving = false
    }
    
    func saveReservationSettings() async {
        isSaving = true
        errorMessage = nil
        successMessage = nil
        
        let settings: [String: String] = [
            "MaxAdvanceReservationDays": maxAdvanceReservationDays,
            "CancellationNoticeHours": minCancellationHours,
            "AutoApproval": autoApproval ? "true" : "false"
        ]
        
        do {
            let updated = try await settingsRepository.updateReservationSettings(settings)
            maxAdvanceReservationDays = updated["MaxAdvanceReservationDays"] ?? "30"
            minCancellationHours = updated["CancellationNoticeHours"] ?? "24"
            autoApproval = updated["AutoApproval"] == "true" || updated["AutoApproval"] == "True"
            successMessage = "Rezervasyon ayarları başarıyla kaydedildi"
        } catch {
            errorMessage = "Ayarlar kaydedilirken bir hata oluştu."
        }
        
        isSaving = false
    }
    
    func saveNotificationSettings() async {
        isSaving = true
        errorMessage = nil
        successMessage = nil
        
        let settings: [String: String] = [
            "EmailEnabled": emailEnabled ? "true" : "false"
        ]
        
        do {
            let updated = try await settingsRepository.updateNotificationSettings(settings)
            emailEnabled = updated["EmailEnabled"] == "true" || updated["EmailEnabled"] == "True"
            successMessage = "Bildirim ayarları başarıyla kaydedildi"
        } catch {
            errorMessage = "Ayarlar kaydedilirken bir hata oluştu."
        }
        
        isSaving = false
    }
    
    func logout() {
        // Delete token from keychain (following frontend pattern - no API call needed)
        keychainManager.deleteToken()
        
        // Clear settings data
        companyName = ""
        timezone = "Europe/Istanbul"
        maxAdvanceReservationDays = "30"
        minCancellationHours = "24"
        autoApproval = false
        emailEnabled = false
        
        // Clear user from AuthStateManager - this will trigger RootView to show OnboardingView
        authStateManager.clearUser()
    }
}

