//
//  UserFormView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct UserFormView: View {
    @Binding var isPresented: Bool
    @ObservedObject var viewModel: UsersManagementViewModel
    
    @State private var name: String = ""
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var department: String = ""
    @State private var role: UserRole = .user
    @State private var status: UserStatus = .active
    
    @State private var errors: [String: String] = [:]
    
    private var isEditMode: Bool {
        viewModel.selectedUser != nil
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Kullanıcı Bilgileri") {
                    // Name
                    TextField("İsim", text: $name)
                        .textFieldStyle(.plain)
                        .font(AppTypography.body1())
                    
                    if let error = errors["name"] {
                        Text(error)
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.errorMain)
                    }
                    
                    // Email
                    TextField("E-posta", text: $email)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .textFieldStyle(.plain)
                        .disabled(isEditMode) // Email cannot be changed
                    
                    if let error = errors["email"] {
                        Text(error)
                            .font(AppTypography.caption())
                            .foregroundColor(AppColors.errorMain)
                    }
                    
                    // Password (only for create)
                    if !isEditMode {
                        SecureField("Şifre", text: $password)
                            .textFieldStyle(.plain)
                        
                        if let error = errors["password"] {
                            Text(error)
                                .font(AppTypography.caption())
                                .foregroundColor(AppColors.errorMain)
                        }
                    }
                    
                    // Department
                    TextField("Departman", text: $department)
                        .textFieldStyle(.plain)
                }
                
                Section("Rol ve Durum") {
                    // Role
                    Picker("Rol", selection: $role) {
                        Text("Kullanıcı").tag(UserRole.user)
                        Text("Admin").tag(UserRole.admin)
                    }
                    
                    // Status (only for edit)
                    if isEditMode {
                        Picker("Durum", selection: $status) {
                            Text("Aktif").tag(UserStatus.active)
                            Text("Pasif").tag(UserStatus.passive)
                        }
                    }
                }
            }
            .navigationTitle(isEditMode ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Oluştur")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("İptal") {
                        isPresented = false
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Kaydet") {
                        saveUser()
                    }
                    .disabled(!isFormValid || viewModel.isLoading)
                }
            }
        }
        .onAppear {
            loadUserData()
        }
    }
    
    private var isFormValid: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty &&
        !email.trimmingCharacters(in: .whitespaces).isEmpty &&
        (isEditMode || !password.isEmpty)
    }
    
    private func loadUserData() {
        if let user = viewModel.selectedUser {
            name = user.name
            email = user.email
            department = user.department ?? ""
            role = user.role
            status = user.status ?? .active
            password = "" // Not loaded for edit
        } else {
            name = ""
            email = ""
            department = ""
            role = .user
            status = .active
            password = ""
        }
        errors = [:]
    }
    
    private func validate() -> Bool {
        errors = [:]
        
        if name.trimmingCharacters(in: .whitespaces).isEmpty {
            errors["name"] = "İsim gereklidir"
        }
        
        if email.trimmingCharacters(in: .whitespaces).isEmpty {
            errors["email"] = "E-posta gereklidir"
        } else if !isValidEmail(email) {
            errors["email"] = "Geçerli bir e-posta adresi girin"
        }
        
        if !isEditMode {
            if password.isEmpty {
                errors["password"] = "Şifre gereklidir"
            } else if password.count < 6 {
                errors["password"] = "Şifre en az 6 karakter olmalıdır"
            }
        }
        
        return errors.isEmpty
    }
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    private func saveUser() {
        guard validate() else { return }
        
        if let user = viewModel.selectedUser {
            let request = UpdateUserRequest(
                name: name.trimmingCharacters(in: .whitespaces),
                email: email.trimmingCharacters(in: .whitespaces),
                department: department.isEmpty ? nil : department.trimmingCharacters(in: .whitespaces),
                role: role.rawValue,
                status: status.rawValue
            )
            
            Task {
                await viewModel.updateUser(id: user.id, request)
                if viewModel.successMessage != nil {
                    isPresented = false
                }
            }
        } else {
            let request = CreateUserRequest(
                name: name.trimmingCharacters(in: .whitespaces),
                email: email.trimmingCharacters(in: .whitespaces),
                password: password,
                department: department.isEmpty ? nil : department.trimmingCharacters(in: .whitespaces),
                role: role.rawValue
            )
            
            Task {
                await viewModel.createUser(request)
                if viewModel.successMessage != nil {
                    isPresented = false
                }
            }
        }
    }
}



