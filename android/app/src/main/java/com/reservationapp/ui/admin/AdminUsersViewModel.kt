package com.reservationapp.ui.admin

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.AdminCreateUserRequest
import com.reservationapp.domain.model.User
import com.reservationapp.domain.model.UserFilterParams
import com.reservationapp.domain.model.UserStatistics
import com.reservationapp.domain.model.UserUpdateRequest
import com.reservationapp.domain.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

enum class UserStatusFilter(val displayName: String, val value: String?) {
    ALL("Tümü", null),
    ACTIVE("Aktif", "Active"),
    PASSIVE("Pasif", "Passive")
}

enum class UserRoleFilter(val displayName: String, val value: String?) {
    ALL("Tümü", null),
    USER("Kullanıcı", "User"),
    ADMIN("Admin", "Admin")
}

class AdminUsersViewModel(
    private val adminRepository: AdminRepository
) : ViewModel() {

    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users.asStateFlow()

    private val _statistics = MutableStateFlow<UserStatistics?>(null)
    val statistics: StateFlow<UserStatistics?> = _statistics.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()

    // Pagination
    private val _currentPage = MutableStateFlow(1)
    val currentPage: StateFlow<Int> = _currentPage.asStateFlow()

    private val _pageSize = MutableStateFlow(10)
    val pageSize: StateFlow<Int> = _pageSize.asStateFlow()

    private val _totalCount = MutableStateFlow(0)
    val totalCount: StateFlow<Int> = _totalCount.asStateFlow()

    // Filters
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _statusFilter = MutableStateFlow(UserStatusFilter.ALL)
    val statusFilter: StateFlow<UserStatusFilter> = _statusFilter.asStateFlow()

    private val _roleFilter = MutableStateFlow(UserRoleFilter.ALL)
    val roleFilter: StateFlow<UserRoleFilter> = _roleFilter.asStateFlow()

    private val _departmentFilter = MutableStateFlow<String>("")
    val departmentFilter: StateFlow<String> = _departmentFilter.asStateFlow()

    // Modals
    private val _showUserForm = MutableStateFlow(false)
    val showUserForm: StateFlow<Boolean> = _showUserForm.asStateFlow()

    private val _editingUser = MutableStateFlow<User?>(null)
    val editingUser: StateFlow<User?> = _editingUser.asStateFlow()

    private val _showDeleteConfirmation = MutableStateFlow(false)
    val showDeleteConfirmation: StateFlow<Boolean> = _showDeleteConfirmation.asStateFlow()

    private val _userToDelete = MutableStateFlow<User?>(null)
    val userToDelete: StateFlow<User?> = _userToDelete.asStateFlow()

    init {
        loadStatistics()
        loadUsers()
    }

    fun loadStatistics() {
        viewModelScope.launch {
            when (val result = adminRepository.getUserStatistics()) {
                is Result.Success -> {
                    _statistics.value = result.data
                }
                is Result.Error -> {
                    _errorMessage.value = "İstatistikler yüklenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
        }
    }

    fun loadUsers() {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            val filterParams = UserFilterParams(
                page = _currentPage.value,
                pageSize = _pageSize.value,
                search = _searchQuery.value.takeIf { it.isNotEmpty() },
                status = _statusFilter.value.value,
                role = _roleFilter.value.value,
                department = _departmentFilter.value.takeIf { it.isNotEmpty() }
            )

            when (val result = adminRepository.getAdminUsers(filterParams)) {
                is Result.Success -> {
                    _users.value = result.data.data
                    _totalCount.value = result.data.totalCount
                }
                is Result.Error -> {
                    _errorMessage.value = "Kullanıcılar yüklenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }

            _isLoading.value = false
        }
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
        _currentPage.value = 1
        loadUsers()
    }

    fun setStatusFilter(filter: UserStatusFilter) {
        _statusFilter.value = filter
        _currentPage.value = 1
        loadUsers()
    }

    fun setRoleFilter(filter: UserRoleFilter) {
        _roleFilter.value = filter
        _currentPage.value = 1
        loadUsers()
    }

    fun setDepartmentFilter(department: String) {
        _departmentFilter.value = department
        _currentPage.value = 1
        loadUsers()
    }

    fun setPage(page: Int) {
        _currentPage.value = page
        loadUsers()
    }

    fun createUser(request: AdminCreateUserRequest) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (adminRepository.createUser(request)) {
                is Result.Success -> {
                    _successMessage.value = "Kullanıcı başarıyla oluşturuldu"
                    loadUsers()
                    loadStatistics()
                    _showUserForm.value = false
                    _editingUser.value = null
                }
                is Result.Error -> {
                    _errorMessage.value = "Kullanıcı oluşturulurken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun updateUser(id: String, request: UserUpdateRequest) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (adminRepository.updateUser(id, request)) {
                is Result.Success -> {
                    _successMessage.value = "Kullanıcı başarıyla güncellendi"
                    loadUsers()
                    loadStatistics()
                    _showUserForm.value = false
                    _editingUser.value = null
                }
                is Result.Error -> {
                    _errorMessage.value = "Kullanıcı güncellenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun deleteUser(user: User) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (adminRepository.deleteUser(user.id)) {
                is Result.Success -> {
                    _successMessage.value = "Kullanıcı başarıyla silindi"
                    loadUsers()
                    loadStatistics()
                    _showDeleteConfirmation.value = false
                    _userToDelete.value = null
                }
                is Result.Error -> {
                    _errorMessage.value = "Kullanıcı silinirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun toggleUserStatus(user: User) {
        val newStatus = if (user.status == "Active") "Passive" else "Active"
        val updateRequest = UserUpdateRequest(
            name = user.name,
            department = user.department,
            role = user.role,
            status = newStatus
        )
        updateUser(user.id, updateRequest)
    }

    fun openCreateForm() {
        _editingUser.value = null
        _showUserForm.value = true
    }

    fun openEditForm(user: User) {
        _editingUser.value = user
        _showUserForm.value = true
    }

    fun hideUserForm() {
        _showUserForm.value = false
        _editingUser.value = null
    }

    fun confirmDelete(user: User) {
        _userToDelete.value = user
        _showDeleteConfirmation.value = true
    }

    fun hideDeleteConfirmation() {
        _showDeleteConfirmation.value = false
        _userToDelete.value = null
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }

    fun clearSuccessMessage() {
        _successMessage.value = null
    }
}

