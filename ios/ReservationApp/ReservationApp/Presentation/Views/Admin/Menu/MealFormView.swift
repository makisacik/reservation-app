//
//  MealFormView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct MealFormView: View {
    @Binding var isPresented: Bool
    @ObservedObject var viewModel: MenuManagementViewModel
    
    @State private var name: String = ""
    @State private var categoryId: String = ""
    @State private var restaurantId: String = ""
    @State private var price: String = ""
    @State private var kcal: String = ""
    @State private var imageUrl: String = ""
    @State private var description: String = ""
    
    @State private var errors: [String: String] = [:]
    
    private var isEditMode: Bool {
        viewModel.editingMeal != nil
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Menü Bilgileri") {
                    // Name
                    TextField("Menü Adı", text: $name)
                        .textFieldStyle(.plain)
                        .font(AppTypography.body1())
                    
                    if let error = errors["name"] {
                        Text(error)
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.errorMain)
                    }
                    
                    // Category
                    Picker("Kategori", selection: $categoryId) {
                        Text("Seçin").tag("")
                        ForEach(viewModel.categories) { category in
                            Text(category.name).tag(category.id)
                        }
                    }
                    
                    if let error = errors["categoryId"] {
                        Text(error)
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.errorMain)
                    }
                    
                    // Restaurant
                    Picker("Restoran", selection: $restaurantId) {
                        Text("Seçin").tag("")
                        ForEach(viewModel.restaurants) { restaurant in
                            Text(restaurant.name).tag(restaurant.id)
                        }
                    }
                    .disabled(isEditMode)
                    
                    if let error = errors["restaurantId"] {
                        Text(error)
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.errorMain)
                    }
                }
                
                Section("Ek Bilgiler") {
                    // Price
                    TextField("Fiyat (₺)", text: $price)
                        .keyboardType(.decimalPad)
                        .textFieldStyle(.plain)
                    
                    if let error = errors["price"] {
                        Text(error)
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.errorMain)
                    }
                    
                    // Calories
                    TextField("Kalori", text: $kcal)
                        .keyboardType(.numberPad)
                        .textFieldStyle(.plain)
                    
                    if let error = errors["kcal"] {
                        Text(error)
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.errorMain)
                    }
                    
                    // Image URL
                    TextField("Görsel URL", text: $imageUrl)
                        .keyboardType(.URL)
                        .autocapitalization(.none)
                        .textFieldStyle(.plain)
                    
                    if let error = errors["imageUrl"] {
                        Text(error)
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.errorMain)
                    }
                }
            }
            .navigationTitle(isEditMode ? "Menü Düzenle" : "Yeni Menü Ekle")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("İptal") {
                        isPresented = false
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Kaydet") {
                        saveMeal()
                    }
                    .disabled(!isFormValid || viewModel.isLoading)
                }
            }
        }
        .onAppear {
            loadMealData()
        }
    }
    
    private var isFormValid: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty &&
        !categoryId.isEmpty &&
        !restaurantId.isEmpty
    }
    
    private func loadMealData() {
        if let meal = viewModel.editingMeal {
            name = meal.name
            categoryId = meal.categoryId
            restaurantId = meal.restaurantId
            price = meal.price.map { String($0) } ?? ""
            kcal = meal.kcal.map { String($0) } ?? ""
            imageUrl = meal.imageUrl ?? ""
            description = meal.description ?? ""
        } else {
            name = ""
            categoryId = ""
            restaurantId = ""
            price = ""
            kcal = ""
            imageUrl = ""
            description = ""
        }
        errors = [:]
    }
    
    private func validate() -> Bool {
        errors = [:]
        
        if name.trimmingCharacters(in: .whitespaces).isEmpty {
            errors["name"] = "Menü adı gereklidir"
        }
        
        if categoryId.isEmpty {
            errors["categoryId"] = "Kategori seçilmelidir"
        }
        
        if restaurantId.isEmpty {
            errors["restaurantId"] = "Restoran seçilmelidir"
        }
        
        if !price.isEmpty {
            if Double(price) == nil {
                errors["price"] = "Geçerli bir fiyat giriniz"
            }
        }
        
        if !kcal.isEmpty {
            if Int(kcal) == nil || Int(kcal)! < 0 {
                errors["kcal"] = "Geçerli bir kalori değeri giriniz"
            }
        }
        
        if !imageUrl.isEmpty {
            if !isValidURL(imageUrl) {
                errors["imageUrl"] = "Geçerli bir URL giriniz"
            }
        }
        
        return errors.isEmpty
    }
    
    private func isValidURL(_ urlString: String) -> Bool {
        guard let url = URL(string: urlString) else { return false }
        return url.scheme == "http" || url.scheme == "https"
    }
    
    private func saveMeal() {
        guard validate() else { return }
        
        if let meal = viewModel.editingMeal {
            let request = UpdateMealRequest(
                name: name.trimmingCharacters(in: .whitespaces),
                categoryId: categoryId,
                description: description.isEmpty ? nil : description,
                price: price.isEmpty ? nil : Double(price),
                kcal: kcal.isEmpty ? nil : Int(kcal),
                imageUrl: imageUrl.isEmpty ? nil : imageUrl
            )
            
            Task {
                await viewModel.updateMeal(id: meal.id, request)
                if viewModel.successMessage != nil {
                    isPresented = false
                }
            }
        } else {
            let request = CreateMealRequest(
                name: name.trimmingCharacters(in: .whitespaces),
                categoryId: categoryId,
                restaurantId: restaurantId,
                description: description.isEmpty ? nil : description,
                price: price.isEmpty ? nil : Double(price),
                kcal: kcal.isEmpty ? nil : Int(kcal),
                imageUrl: imageUrl.isEmpty ? nil : imageUrl
            )
            
            Task {
                await viewModel.createMeal(request)
                if viewModel.successMessage != nil {
                    isPresented = false
                }
            }
        }
    }
}

