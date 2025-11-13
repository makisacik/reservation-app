//
//  UsersManagementViewModel.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class UsersManagementViewModel: ObservableObject {
    @Published var users: [User] = []
    @Published var statistics: UserStatistics?
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var successMessage: String?
    
    // Pagination
    @Published var currentPage: Int = 0
    @Published var pageSize: Int = 10
    @Published var totalCount: Int = 0
    
    // Search
    @Published var searchQuery: String = ""
    
    // Modals
    @Published var showCreateForm = false
    @Published var showEditForm = false
    @Published var showDetailView = false
    @Published var showDeleteConfirmation = false
    @Published var selectedUser: User?
    @Published var userToDelete: User?
    
    private let adminRepository: AdminRepositoryProtocol
    
    init(adminRepository: AdminRepositoryProtocol = AdminRepository()) {
        self.adminRepository = adminRepository
    }
    
    func loadUsers() async {
        isLoading = true
        errorMessage = nil
        
        let queryParams = UserFilterParams(
            page: currentPage + 1,
            pageSize: pageSize,
            search: searchQuery.isEmpty ? nil : searchQuery
        )
        
        async let usersTask = adminRepository.getAdminUsers(queryParams: queryParams)
        async let statisticsTask = adminRepository.getUserStatistics()
        
        do {
            let (result, statsResult) = try await (usersTask, statisticsTask)
            self.users = result.data
            self.totalCount = result.totalCount
            self.statistics = statsResult
        } catch {
            errorMessage = "Kullanıcılar yüklenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func refresh() async {
        await loadUsers()
    }
    
    func createUser(_ request: CreateUserRequest) async {
        isLoading = true
        errorMessage = nil
        
        do {
            _ = try await adminRepository.createUser(userData: request)
            successMessage = "Kullanıcı başarıyla oluşturuldu"
            await loadUsers()
            showCreateForm = false
        } catch {
            errorMessage = "Kullanıcı oluşturulurken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func updateUser(id: String, _ request: UpdateUserRequest) async {
        isLoading = true
        errorMessage = nil
        
        do {
            _ = try await adminRepository.updateUser(id: id, userData: request)
            successMessage = "Kullanıcı başarıyla güncellendi"
            await loadUsers()
            showEditForm = false
            selectedUser = nil
        } catch {
            errorMessage = "Kullanıcı güncellenirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func deleteUser(_ user: User) async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await adminRepository.deleteUser(id: user.id)
            successMessage = "Kullanıcı başarıyla silindi"
            await loadUsers()
            showDeleteConfirmation = false
            userToDelete = nil
        } catch {
            errorMessage = "Kullanıcı silinirken bir hata oluştu."
        }
        
        isLoading = false
    }
    
    func searchUsers() {
        currentPage = 0
        Task {
            await loadUsers()
        }
    }
    
    func changePage(_ page: Int) {
        currentPage = page
        Task {
            await loadUsers()
        }
    }
    
    func openCreateForm() {
        selectedUser = nil
        showCreateForm = true
    }
    
    func openEditForm(_ user: User) {
        selectedUser = user
        showEditForm = true
    }
    
    func openDetailView(_ user: User) {
        selectedUser = user
        showDetailView = true
    }
    
    func confirmDelete(_ user: User) {
        userToDelete = user
        showDeleteConfirmation = true
    }
}

