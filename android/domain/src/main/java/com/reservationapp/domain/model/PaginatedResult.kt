package com.reservationapp.domain.model

data class PaginatedResult<T>(
    val data: List<T>,
    val totalCount: Int,
    val page: Int,
    val pageSize: Int
)

