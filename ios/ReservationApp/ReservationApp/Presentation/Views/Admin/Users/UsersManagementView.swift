//
//  UsersManagementView.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct UsersManagementView: View {
    @StateObject private var viewModel = UsersManagementViewModel()
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ThemeManager.shared.spacing.lg) {
                    // Header
                    HStack {
                        VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.xs) {
                            Text("Kullanıcılar")
                                .font(AppTypography.h4())
                                .foregroundColor(AppColors.textPrimary)
                            
                            Text("Kullanıcıları yönetin")
                                .font(AppTypography.body2())
                                .foregroundColor(AppColors.textSecondary)
                        }
                        
                        Spacer()
                        
                        Button(action: {
                            viewModel.openCreateForm()
                        }) {
                            HStack {
                                Image(systemName: "person.badge.plus")
                                Text("Yeni Kullanıcı")
                            }
                            .font(AppTypography.button())
                            .foregroundColor(.white)
                            .padding(.horizontal, ThemeManager.shared.spacing.lg)
                            .padding(.vertical, ThemeManager.shared.spacing.md)
                            .background(AppColors.primaryMain)
                            .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                        }
                    }
                    
                    // Search Bar
                    HStack(spacing: ThemeManager.shared.spacing.sm) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(AppColors.textTertiary)
                        
                        TextField(
                            "Kullanıcı ara...",
                            text: $viewModel.searchQuery
                        )
                        .textFieldStyle(PlainTextFieldStyle())
                        .font(AppTypography.body1())
                        .onSubmit {
                            viewModel.searchUsers()
                        }
                        .onChange(of: viewModel.searchQuery) { _ in
                            // Debounce search - could add delay here
                        }
                    }
                    .padding(ThemeManager.shared.spacing.md)
                    .background(AppColors.backgroundPaper)
                    .cornerRadius(ThemeManager.shared.borderRadius.button.value)
                    .overlay(
                        RoundedRectangle(cornerRadius: ThemeManager.shared.borderRadius.button.value)
                            .stroke(AppColors.borderDefault, lineWidth: 1)
                    )
                    
                    // Statistics Cards
                    UserStatisticsCardsView(
                        statistics: viewModel.statistics,
                        isLoading: viewModel.isLoading
                    )
                    
                    // Users List
                    VStack(alignment: .leading, spacing: ThemeManager.shared.spacing.md) {
                        Text("Kullanıcı Listesi")
                            .font(AppTypography.h6())
                            .fontWeight(.semibold)
                            .foregroundColor(AppColors.textPrimary)
                        
                        if viewModel.isLoading && viewModel.users.isEmpty {
                            ProgressView()
                                .frame(maxWidth: .infinity)
                                .padding(ThemeManager.shared.spacing.xl)
                        } else if viewModel.users.isEmpty {
                            EmptyUsersView()
                        } else {
                            VStack(spacing: ThemeManager.shared.spacing.md) {
                                ForEach(viewModel.users) { user in
                                    UserRowView(
                                        user: user,
                                        onEdit: {
                                            viewModel.openEditForm(user)
                                        },
                                        onDetail: {
                                            viewModel.openDetailView(user)
                                        }
                                    )
                                }
                            }
                            
                            // Pagination
                            PaginationView(
                                currentPage: viewModel.currentPage,
                                totalPages: (viewModel.totalCount + viewModel.pageSize - 1) / viewModel.pageSize,
                                pageSize: viewModel.pageSize,
                                onPageChange: { page in
                                    viewModel.changePage(page)
                                }
                            )
                        }
                    }
                }
                .padding(.horizontal, ThemeManager.shared.spacing.md)
                .padding(.vertical, ThemeManager.shared.spacing.md)
            }
            .background(AppColors.backgroundPage)
            .refreshable {
                await viewModel.refresh()
            }
            .task {
                await viewModel.loadUsers()
            }
            .sheet(isPresented: $viewModel.showCreateForm) {
                UserFormView(
                    isPresented: $viewModel.showCreateForm,
                    viewModel: viewModel
                )
            }
            .sheet(isPresented: $viewModel.showEditForm) {
                UserFormView(
                    isPresented: $viewModel.showEditForm,
                    viewModel: viewModel
                )
            }
            .sheet(isPresented: $viewModel.showDetailView) {
                UserDetailView(
                    user: viewModel.selectedUser,
                    isPresented: $viewModel.showDetailView
                )
            }
            .alert("Kullanıcı Sil", isPresented: $viewModel.showDeleteConfirmation) {
                Button("İptal", role: .cancel) {
                    viewModel.userToDelete = nil
                }
                Button("Sil", role: .destructive) {
                    if let user = viewModel.userToDelete {
                        Task {
                            await viewModel.deleteUser(user)
                        }
                    }
                }
            } message: {
                if let user = viewModel.userToDelete {
                    Text("\"\(user.name)\" kullanıcısını silmek istediğinize emin misiniz?")
                }
            }
            .alert("Hata", isPresented: .constant(viewModel.errorMessage != nil)) {
                Button("Tamam") {
                    viewModel.errorMessage = nil
                }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
            .alert("Başarılı", isPresented: .constant(viewModel.successMessage != nil)) {
                Button("Tamam") {
                    viewModel.successMessage = nil
                }
            } message: {
                Text(viewModel.successMessage ?? "")
            }
        }
    }
}

struct EmptyUsersView: View {
    var body: some View {
        VStack(spacing: ThemeManager.shared.spacing.md) {
            Image(systemName: "person.2.slash")
                .font(.system(size: 48))
                .foregroundColor(AppColors.textTertiary)
            
            Text("Kullanıcı bulunamadı")
                .font(AppTypography.body1())
                .foregroundColor(AppColors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(ThemeManager.shared.spacing.xl)
        .background(AppColors.backgroundPaper)
        .cornerRadius(ThemeManager.shared.borderRadius.card.value)
    }
}

