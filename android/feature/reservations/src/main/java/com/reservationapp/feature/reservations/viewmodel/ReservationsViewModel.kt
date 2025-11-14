package com.reservationapp.feature.reservations.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.reservationapp.core.common.Result
import com.reservationapp.domain.model.Reservation
import com.reservationapp.domain.repository.ReservationRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

enum class ReservationTab {
    ACTIVE,
    PAST
}

class ReservationsViewModel(
    private val reservationRepository: ReservationRepository
) : ViewModel() {

    private val _reservations = MutableStateFlow<List<Reservation>>(emptyList())
    val reservations: StateFlow<List<Reservation>> = _reservations.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    private val _activeTab = MutableStateFlow(ReservationTab.ACTIVE)
    val activeTab: StateFlow<ReservationTab> = _activeTab.asStateFlow()

    val filteredReservations: StateFlow<List<Reservation>> = 
        combine(_reservations, _activeTab) { reservations, tab ->
            filterReservations(reservations, tab)
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    init {
        loadReservations()
    }

    fun loadReservations() {
        _isLoading.value = true
        _errorMessage.value = null

        viewModelScope.launch {
            when (val result = reservationRepository.getMyReservations()) {
                is Result.Success -> {
                    _reservations.value = result.data
                }
                is Result.Error -> {
                    _errorMessage.value = "Rezervasyonlar yüklenirken bir hata oluştu."
                }
                is Result.Loading -> {
                    // Handle loading state
                }
            }
            _isLoading.value = false
        }
    }

    fun refresh() {
        loadReservations()
    }

    fun setActiveTab(tab: ReservationTab) {
        _activeTab.value = tab
    }

    private fun filterReservations(
        reservations: List<Reservation>,
        tab: ReservationTab
    ): List<Reservation> {
        val now = Date()
        // Try multiple ISO 8601 formats
        val formats = listOf(
            SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()),
            SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()),
            SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault()),
            SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        )
        formats.forEach { it.timeZone = TimeZone.getTimeZone("UTC") }

        return reservations
            .filter { reservation ->
                try {
                    var reservationDate: Date? = null
                    for (format in formats) {
                        try {
                            reservationDate = format.parse(reservation.date)
                            break
                        } catch (e: Exception) {
                            // Try next format
                        }
                    }
                    if (reservationDate == null) return@filter false
                    val isPast = reservationDate < now
                    val isCancelled = reservation.status.equals("Cancelled", ignoreCase = true)

                    when (tab) {
                        ReservationTab.ACTIVE -> !isPast && !isCancelled
                        ReservationTab.PAST -> isPast || isCancelled
                    }
                } catch (e: Exception) {
                    false
                }
            }
            .sortedWith { res1, res2 ->
                try {
                    var date1: Date? = null
                    var date2: Date? = null
                    for (format in formats) {
                        try {
                            if (date1 == null) date1 = format.parse(res1.date)
                            if (date2 == null) date2 = format.parse(res2.date)
                            if (date1 != null && date2 != null) break
                        } catch (e: Exception) {
                            // Try next format
                        }
                    }
                    val d1 = date1 ?: Date(0)
                    val d2 = date2 ?: Date(0)
                    
                    if (tab == ReservationTab.ACTIVE) {
                        d1.compareTo(d2) // Ascending for active
                    } else {
                        d2.compareTo(d1) // Descending for past
                    }
                } catch (e: Exception) {
                    0
                }
            }
    }
}

