package com.reservationapp.feature.reservations.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Event
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.reservationapp.core.ui.theme.*
import com.reservationapp.domain.repository.ReservationRepository
import com.reservationapp.feature.reservations.viewmodel.ReservationTab
import com.reservationapp.feature.reservations.viewmodel.ReservationsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReservationsScreen(
    reservationRepository: ReservationRepository,
    viewModel: ReservationsViewModel = remember {
        ReservationsViewModel(reservationRepository)
    }
) {
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    val filteredReservations by viewModel.filteredReservations.collectAsState()
    val activeTab by viewModel.activeTab.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundPage)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(Spacing.lg),
                verticalArrangement = Arrangement.spacedBy(Spacing.xs)
            ) {
                Text(
                    text = "Rezervasyonlarım",
                    style = Typography.titleLarge,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary
                )
                Text(
                    text = "Geçmiş ve aktif rezervasyonlarınız",
                    style = Typography.bodyMedium,
                    color = TextTertiary
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = Spacing.lg)
                    .padding(bottom = Spacing.md),
                horizontalArrangement = Arrangement.spacedBy(Spacing.md)
            ) {
                TabButton(
                    title = "Aktif Rezervasyonlar",
                    isSelected = activeTab == ReservationTab.ACTIVE,
                    onClick = { viewModel.setActiveTab(ReservationTab.ACTIVE) }
                )
                TabButton(
                    title = "Geçmiş Rezervasyonlar",
                    isSelected = activeTab == ReservationTab.PAST,
                    onClick = { viewModel.setActiveTab(ReservationTab.PAST) }
                )
            }
            when {
                isLoading && filteredReservations.isEmpty() -> {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(Spacing.xl),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = PrimaryMain)
                    }
                }
                filteredReservations.isEmpty() -> {
                    EmptyReservationsView(tab = activeTab)
                }
                else -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(vertical = Spacing.md)
                    ) {
                        filteredReservations.forEach { reservation ->
                            ReservationCard(
                                reservation = reservation,
                                mealName = reservation.menuName.ifEmpty { "Menü" }
                            )
                            Spacer(modifier = Modifier.height(Spacing.md))
                        }
                    }
                }
            }
        }

        errorMessage?.let { error ->
            Card(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .padding(Spacing.md),
                colors = CardDefaults.cardColors(containerColor = ErrorMain.copy(alpha = 0.1f))
            ) {
                Text(
                    text = error,
                    style = Typography.bodyMedium,
                    color = ErrorMain,
                    modifier = Modifier.padding(Spacing.md)
                )
            }
        }
    }
}

@Composable
fun RowScope.TabButton(
    title: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    if (isSelected) {
        Button(
            onClick = onClick,
            modifier = Modifier
                .weight(1f)
                .height(40.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = BackgroundActiveTab,
                contentColor = PrimaryMain
            ),
            shape = RoundedCornerShape(8.dp),
            elevation = null
        ) {
            Text(
                text = title,
                style = Typography.bodyMedium,
                fontWeight = FontWeight.SemiBold
            )
        }
    } else {
        TextButton(
            onClick = onClick,
            modifier = Modifier
                .weight(1f)
                .height(40.dp)
                .border(1.dp, BorderDefault, RoundedCornerShape(8.dp)),
            colors = ButtonDefaults.textButtonColors(
                contentColor = TextSecondary
            ),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text(
                text = title,
                style = Typography.bodyMedium,
                fontWeight = FontWeight.Normal
            )
        }
    }
}

@Composable
fun EmptyReservationsView(tab: ReservationTab) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(Spacing.xl),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.Event,
            contentDescription = null,
            modifier = Modifier.size(48.dp),
            tint = TextTertiary
        )
        Spacer(modifier = Modifier.height(Spacing.md))
        Text(
            text = if (tab == ReservationTab.ACTIVE) {
                "Aktif rezervasyonunuz bulunmamaktadır."
            } else {
                "Geçmiş rezervasyonunuz bulunmamaktadır."
            },
            style = Typography.bodyMedium,
            color = TextSecondary
        )
    }
}

