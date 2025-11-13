package com.reservationapp.core.common.extensions

import java.text.SimpleDateFormat
import java.util.*

/**
 * Format date to Turkish format: "4 Kasım 2025"
 */
fun Date.toTurkishFormat(): String {
    val turkishMonths = arrayOf(
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    )
    val calendar = Calendar.getInstance()
    calendar.time = this
    val day = calendar.get(Calendar.DAY_OF_MONTH)
    val month = turkishMonths[calendar.get(Calendar.MONTH)]
    val year = calendar.get(Calendar.YEAR)
    return "$day $month $year"
}

/**
 * Format date to Turkish format with time: "4 Kasım 2025 14:30"
 */
fun Date.toTurkishFormatWithTime(): String {
    val dateFormat = SimpleDateFormat("d MMMM yyyy HH:mm", Locale("tr", "TR"))
    return dateFormat.format(this)
}

/**
 * Parse ISO 8601 date string
 */
fun String.toDate(): Date? {
    return try {
        val format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        format.timeZone = TimeZone.getTimeZone("UTC")
        format.parse(this)
    } catch (e: Exception) {
        null
    }
}

