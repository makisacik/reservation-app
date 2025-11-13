//
//  MakeReservationViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

// Date selection model
struct SelectedDate: Identifiable, Equatable {
    let id = UUID()
    let date: String // YYYY-MM-DD format
    var mealTimeSlotId: Int?
    
    static func == (lhs: SelectedDate, rhs: SelectedDate) -> Bool {
        lhs.date == rhs.date
    }
}

@MainActor
class MakeReservationViewModel: ObservableObject {
    @Published var currentStep: Int = 1
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var successMessage: String?
    
    // Reservation data
    @Published var selectedDates: [SelectedDate] = []
    @Published var selectedRestaurant: Restaurant?
    @Published var selectedMenuType: MenuType?
    @Published var selectedMenu: Menu?
    @Published var selectedMeal: Meal?
    @Published var appetizer: Bool = false
    
    // Available options
    @Published var restaurants: [Restaurant] = []
    @Published var mealTimeSlots: [MealTimeSlot] = []
    @Published var availableMenus: [Menu] = []
    
    private let homeRepository: HomeRepositoryProtocol
    private let reservationRepository: ReservationRepositoryProtocol
    
    let maxDateSelections = 2
    
    init(
        homeRepository: HomeRepositoryProtocol = HomeRepository(),
        reservationRepository: ReservationRepositoryProtocol = ReservationRepository()
    ) {
        self.homeRepository = homeRepository
        self.reservationRepository = reservationRepository
    }
    
    func loadInitialData() async {
        isLoading = true
        errorMessage = nil
        
        async let restaurantsTask = homeRepository.getRestaurants()
        async let mealTimeSlotsTask = homeRepository.getMealTimeSlots()
        
        do {
            let (restaurantsResult, mealTimeSlotsResult) = try await (restaurantsTask, mealTimeSlotsTask)
            self.restaurants = restaurantsResult
            self.mealTimeSlots = mealTimeSlotsResult
        } catch {
            errorMessage = "Veriler yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func loadMenus() async {
        guard let firstDate = selectedDates.first?.date,
              let restaurant = selectedRestaurant,
              let menuType = selectedMenuType else {
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            // Fetch menus for the first date
            // Note: Backend expects date, restaurantId, and menuType
            let menus = try await homeRepository.getMenus(
                date: firstDate,
                restaurantId: restaurant.id,
                menuType: menuType
            )
            self.availableMenus = menus
        } catch {
            errorMessage = "Menüler yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func selectDate(_ date: String) {
        if let index = selectedDates.firstIndex(where: { $0.date == date }) {
            // Deselect
            selectedDates.remove(at: index)
        } else {
            // Check max selections
            if selectedDates.count >= maxDateSelections {
                return
            }
            // Add new date
            selectedDates.append(SelectedDate(date: date, mealTimeSlotId: nil))
        }
    }
    
    func selectMealTimeSlot(for date: String, slotId: Int) {
        if let index = selectedDates.firstIndex(where: { $0.date == date }) {
            selectedDates[index].mealTimeSlotId = slotId
        }
    }
    
    func canProceedToNextStep() -> Bool {
        switch currentStep {
        case 1:
            return selectedDates.count > 0 &&
                   selectedDates.count <= maxDateSelections &&
                   selectedDates.allSatisfy { $0.mealTimeSlotId != nil }
        case 2:
            return selectedRestaurant != nil
        case 3:
            return selectedMenuType != nil
        case 4:
            return selectedMenu != nil
        case 5:
            return true
        default:
            return false
        }
    }
    
    func nextStep() {
        if canProceedToNextStep() && currentStep < 5 {
            if currentStep == 3 {
                // Load menus when moving to step 4
                Task {
                    await loadMenus()
                }
            }
            currentStep += 1
        }
    }
    
    func previousStep() {
        if currentStep > 1 {
            currentStep -= 1
        }
    }
    
    func submitReservation() async {
        guard canProceedToNextStep() else { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            // Fetch menus for each date
            var menuResults: [[Menu]] = []
            
            for dateObj in selectedDates {
                let menus = try await homeRepository.getMenus(
                    date: dateObj.date,
                    restaurantId: selectedRestaurant!.id,
                    menuType: selectedMenuType!
                )
                menuResults.append(menus)
            }
            
            // Create reservations for each date
            var reservationTasks: [Task<Reservation, Error>] = []
            
            for (index, dateObj) in selectedDates.enumerated() {
                guard let menuForDate = menuResults[index].first else {
                    throw NSError(domain: "ReservationError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Menu not found for date \(dateObj.date)"])
                }
                
                let dateTimeString = "\(dateObj.date)T00:00:00Z"
                
                let request = CreateReservationRequest(
                    restaurantId: selectedRestaurant!.id,
                    menuId: menuForDate.id,
                    mealTimeSlotId: dateObj.mealTimeSlotId!,
                    date: dateTimeString,
                    appetizer: appetizer
                )
                
                let task = Task {
                    try await reservationRepository.createReservation(request)
                }
                reservationTasks.append(task)
            }
            
            // Wait for all reservations to complete
            var reservations: [Reservation] = []
            for task in reservationTasks {
                let reservation = try await task.value
                reservations.append(reservation)
            }
            
            successMessage = "Rezervasyonunuz başarıyla oluşturuldu! \(selectedDates.count) gün için rezervasyon yapıldı."
            
            // Reset form after delay
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                self.resetForm()
            }
            
        } catch {
            errorMessage = "Rezervasyon oluşturulurken bir hata oluştu: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    private func resetForm() {
        selectedDates = []
        selectedRestaurant = nil
        selectedMenuType = nil
        selectedMenu = nil
        selectedMeal = nil
        appetizer = false
        currentStep = 1
    }
}
