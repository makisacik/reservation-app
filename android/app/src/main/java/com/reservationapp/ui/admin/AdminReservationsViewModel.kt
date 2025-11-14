package com.reservationapp.ui.admin

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.AdminCreateReservationRequest
import com.reservationapp.domain.model.AdminReservationQueryParams
import com.reservationapp.domain.model.Reservation
import com.reservationapp.domain.model.ReservationSummary
import com.reservationapp.domain.repository.AdminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

enum class ReservationStatusFilter(val displayName: String, val value: String?) {
    ALL("Tümü", null),
    PENDING("Beklemede", "Pending"),
    ACTIVE("Onaylandı", "Active"),
    CANCELLED("İptal", "Cancelled")
}

class AdminReservationsViewModel(
    private val adminRepository: AdminRepository
) : ViewModel() {

    private val _reservations = MutableStateFlow<List<Reservation>>(emptyList())
    val reservations: StateFlow<List<Reservation>> = _reservations.asStateFlow()

    private val _summary = MutableStateFlow<ReservationSummary?>(null)
    val summary: StateFlow<ReservationSummary?> = _summary.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()

    // Pagination
    private val _currentPage = MutableStateFlow(0)
    val currentPage: StateFlow<Int> = _currentPage.asStateFlow()

    private val _pageSize = MutableStateFlow(10)
    val pageSize: StateFlow<Int> = _pageSize.asStateFlow()

    private val _totalCount = MutableStateFlow(0)
    val totalCount: StateFlow<Int> = _totalCount.asStateFlow()

    // Filters
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _statusFilter = MutableStateFlow(ReservationStatusFilter.ALL)
    val statusFilter: StateFlow<ReservationStatusFilter> = _statusFilter.asStateFlow()

    private val _dateFrom = MutableStateFlow<Date?>(null)
    val dateFrom: StateFlow<Date?> = _dateFrom.asStateFlow()

    private val _dateTo = MutableStateFlow<Date?>(null)
    val dateTo: StateFlow<Date?> = _dateTo.asStateFlow()

    // Modals
    private val _showCreateModal = MutableStateFlow(false)
    val showCreateModal: StateFlow<Boolean> = _showCreateModal.asStateFlow()

    private val _showDetailModal = MutableStateFlow(false)
    val showDetailModal: StateFlow<Boolean> = _showDetailModal.asStateFlow()

    private val _showApprovalDialog = MutableStateFlow(false)
    val showApprovalDialog: StateFlow<Boolean> = _showApprovalDialog.asStateFlow()

    private val _selectedReservationId = MutableStateFlow<String?>(null)
    val selectedReservationId: StateFlow<String?> = _selectedReservationId.asStateFlow()

    private val _reservationToApprove = MutableStateFlow<Reservation?>(null)
    val reservationToApprove: StateFlow<Reservation?> = _reservationToApprove.asStateFlow()

    init {
        // Set default date range to current month
        val calendar = Calendar.getInstance()
        val now = Date()
        calendar.time = now
        calendar.set(Calendar.DAY_OF_MONTH, 1)
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        _dateFrom.value = calendar.time
        
        calendar.add(Calendar.MONTH, 1)
        _dateTo.value = calendar.time
        
        loadReservations()
    }

    fun loadReservations() {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            val queryParams = AdminReservationQueryParams(
                page = _currentPage.value + 1,
                pageSize = _pageSize.value,
                dateFrom = formatDate(_dateFrom.value),
                dateTo = formatDate(_dateTo.value),
                search = _searchQuery.value.takeIf { it.isNotEmpty() },
                status = _statusFilter.value.value
            )

            val reservationsTask = adminRepository.getAdminReservations(queryParams)
            val summaryTask = adminRepository.getReservationSummary()

            when (reservationsTask) {
                is Result.Success -> {
                    _reservations.value = reservationsTask.data.data
                    _totalCount.value = reservationsTask.data.totalCount
                }
                is Result.Error -> {
                    _errorMessage.value = "Rezervasyonlar yüklenirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }

            when (summaryTask) {
                is Result.Success -> {
                    _summary.value = summaryTask.data
                }
                is Result.Error -> { /* Handle error silently */ }
                is Result.Loading -> { /* Handle loading */ }
            }

            _isLoading.value = false
        }
    }

    fun refresh() {
        loadReservations()
    }

    fun approveReservation(reservation: Reservation) {
        _showApprovalDialog.value = false
        _reservationToApprove.value = null

        // Optimistically update
        val index = _reservations.value.indexOfFirst { it.id == reservation.id }
        if (index >= 0) {
            val updated = _reservations.value.toMutableList()
            updated[index] = reservation.copy(status = "Active")
            _reservations.value = updated

            _summary.value?.let { currentSummary ->
                _summary.value = currentSummary.copy(
                    pendingCount = maxOf(0, currentSummary.pendingCount - 1)
                )
            }
        }

        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (val result = adminRepository.approveReservation(reservation.id)) {
                is Result.Success -> {
                    _successMessage.value = "Rezervasyon başarıyla onaylandı"
                    loadReservations()
                }
                is Result.Error -> {
                    _errorMessage.value = "Rezervasyon onaylanırken bir hata oluştu."
                    loadReservations() // Reload to get correct state
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun cancelReservation(reservation: Reservation) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (val result = adminRepository.cancelReservation(reservation.id)) {
                is Result.Success -> {
                    _successMessage.value = "Rezervasyon başarıyla iptal edildi"
                    loadReservations()
                }
                is Result.Error -> {
                    _errorMessage.value = "Rezervasyon iptal edilirken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun createReservation(request: AdminCreateReservationRequest) {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (val result = adminRepository.createReservation(request)) {
                is Result.Success -> {
                    _successMessage.value = "Rezervasyon başarıyla oluşturuldu"
                    loadReservations()
                    _showCreateModal.value = false
                }
                is Result.Error -> {
                    _errorMessage.value = "Rezervasyon oluşturulurken bir hata oluştu."
                }
                is Result.Loading -> { /* Handle loading */ }
            }
            _isLoading.value = false
        }
    }

    fun changePage(page: Int) {
        _currentPage.value = page
        loadReservations()
    }

    fun applyFilters() {
        _currentPage.value = 0
        loadReservations()
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setStatusFilter(filter: ReservationStatusFilter) {
        _statusFilter.value = filter
    }

    fun setDateFrom(date: Date?) {
        _dateFrom.value = date
    }

    fun setDateTo(date: Date?) {
        _dateTo.value = date
    }

    fun showCreateModal() {
        _showCreateModal.value = true
    }

    fun hideCreateModal() {
        _showCreateModal.value = false
    }

    fun showDetailModal(reservationId: String) {
        _selectedReservationId.value = reservationId
        _showDetailModal.value = true
    }

    fun hideDetailModal() {
        _showDetailModal.value = false
        _selectedReservationId.value = null
    }

    fun showApprovalDialog(reservation: Reservation) {
        _reservationToApprove.value = reservation
        _showApprovalDialog.value = true
    }

    fun hideApprovalDialog() {
        _showApprovalDialog.value = false
        _reservationToApprove.value = null
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }

    fun clearSuccessMessage() {
        _successMessage.value = null
    }

    private fun formatDate(date: Date?): String? {
        if (date == null) return null
        val formatter = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        return formatter.format(date)
    }
}

