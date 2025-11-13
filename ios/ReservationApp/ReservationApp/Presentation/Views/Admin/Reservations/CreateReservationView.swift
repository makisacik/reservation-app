//
//  CreateReservationView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct CreateReservationView: View {
    @Binding var isPresented: Bool
    @ObservedObject var viewModel: AdminReservationsViewModel
    
    @State private var selectedUserId: String = ""
    @State private var selectedRestaurantId: String = ""
    @State private var selectedMenuId: String = ""
    @State private var selectedMealTimeSlotId: Int?
    @State private var selectedDate: Date = Date()
    @State private var appetizer: Bool = false
    
    @State private var users: [User] = []
    @State private var restaurants: [Restaurant] = []
    @State private var mealTimeSlots: [MealTimeSlot] = []
    @State private var availableMenus: [Menu] = []
    
    @State private var isLoadingData = false
    @State private var isLoadingMenus = false
    
    private let homeRepository: HomeRepositoryProtocol = HomeRepository()
    private let apiClient: APIClient = APIClient.shared
    
    var body: some View {
        NavigationStack {
            Form {
                // User Selection
                Section("Kullanıcı") {
                    Picker("Kullanıcı", selection: $selectedUserId) {
                        Text("Seçiniz").tag("")
                        ForEach(users) { user in
                            Text("\(user.name) (\(user.email))").tag(user.id)
                        }
                    }
                }
                
                // Date Selection
                Section("Tarih") {
                    DatePicker("Tarih", selection: $selectedDate, displayedComponents: .date)
                        .onChange(of: selectedDate) {
                            selectedMenuId = ""
                            loadMenus()
                        }
                }
                
                // Restaurant Selection
                Section("Restoran") {
                    Picker("Restoran", selection: $selectedRestaurantId) {
                        Text("Seçiniz").tag("")
                        ForEach(restaurants) { restaurant in
                            Text(restaurant.name).tag(restaurant.id)
                        }
                    }
                    .onChange(of: selectedRestaurantId) {
                        selectedMenuId = ""
                        loadMenus()
                    }
                }
                
                // Meal Time Slot Selection
                Section("Öğün") {
                    Picker("Öğün", selection: $selectedMealTimeSlotId) {
                        Text("Seçiniz").tag(nil as Int?)
                        ForEach(mealTimeSlots) { slot in
                            Text("\(slot.turkishName) (\(slot.formattedTimeRange))").tag(slot.id as Int?)
                        }
                    }
                }
                
                // Menu Selection
                Section("Menü") {
                    if isLoadingMenus {
                        ProgressView()
                    } else {
                        Picker("Menü", selection: $selectedMenuId) {
                            Text("Seçiniz").tag("")
                            ForEach(availableMenus) { menu in
                                Text(menuMealNames(menu)).tag(menu.id)
                            }
                        }
                        .disabled(selectedRestaurantId.isEmpty || availableMenus.isEmpty)
                    }
                }
                
                // Appetizer Toggle
                Section {
                    Toggle("Çorba İstiyorum", isOn: $appetizer)
                }
            }
            .navigationTitle("Yeni Rezervasyon")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("İptal") {
                        isPresented = false
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Oluştur") {
                        createReservation()
                    }
                    .disabled(!isFormValid || viewModel.isLoading)
                }
            }
        }
        .task {
            await loadInitialData()
        }
    }
    
    private var isFormValid: Bool {
        !selectedUserId.isEmpty &&
        !selectedRestaurantId.isEmpty &&
        !selectedMenuId.isEmpty &&
        selectedMealTimeSlotId != nil
    }
    
    private func loadInitialData() async {
        isLoadingData = true
        
        await loadUsers()
        await loadRestaurants()
        await loadMealTimeSlots()
        
        isLoadingData = false
    }
    
    private func loadUsers() async {
        do {
            self.users = try await apiClient.request(
                endpoint: .allUsers,
                responseType: [User].self
            )
        } catch {
            // Handle error silently or show alert
            print("Error loading users: \(error)")
        }
    }
    
    private func loadRestaurants() async {
        do {
            self.restaurants = try await homeRepository.getRestaurants()
        } catch {
            print("Error loading restaurants: \(error)")
        }
    }
    
    private func loadMealTimeSlots() async {
        do {
            self.mealTimeSlots = try await homeRepository.getMealTimeSlots()
        } catch {
            print("Error loading meal time slots: \(error)")
        }
    }
    
    private func loadMenus() {
        guard !selectedRestaurantId.isEmpty else {
            availableMenus = []
            return
        }
        
        isLoadingMenus = true
        
        Task {
            do {
                let dateFormatter = ISO8601DateFormatter()
                dateFormatter.formatOptions = [.withFullDate]
                let dateString = dateFormatter.string(from: selectedDate)
                
                // Load menus for selected date and restaurant
                // Note: We'll load all menus and filter by date/restaurant
                let menus = try await homeRepository.getMenus(
                    date: dateString,
                    restaurantId: selectedRestaurantId,
                    menuType: .standard // Default to standard, could be made selectable
                )
                self.availableMenus = menus
            } catch {
                print("Error loading menus: \(error)")
                self.availableMenus = []
            }
            isLoadingMenus = false
        }
    }
    
    private func menuMealNames(_ menu: Menu) -> String {
        let names = menu.meals.map { $0.name }
        return names.isEmpty ? "Menü - \(menu.date)" : names.joined(separator: " & ")
    }
    
    private func createReservation() {
        let dateFormatter = ISO8601DateFormatter()
        dateFormatter.formatOptions = [.withInternetDateTime]
        
        // Format date as ISO 8601 datetime string (backend expects full datetime)
        // Use the selected date with time set to 00:00:00 UTC
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month, .day], from: selectedDate)
        guard let dateWithTime = calendar.date(from: components) else {
            return
        }
        
        // Format as ISO 8601 with time
        let dateString = dateFormatter.string(from: dateWithTime)
        
        let request = AdminCreateReservationRequest(
            userId: selectedUserId,
            restaurantId: selectedRestaurantId,
            menuId: selectedMenuId,
            mealTimeSlotId: selectedMealTimeSlotId!,
            date: dateString,
            appetizer: appetizer
        )
        
        Task {
            await viewModel.createReservation(request)
            if viewModel.successMessage != nil {
                isPresented = false
            }
        }
    }
}

