//
//  ReservationRepositoryProtocol.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import Combine

protocol ReservationRepositoryProtocol {
    func getMyReservations() async throws -> [Reservation]
    func createReservation(_ reservation: CreateReservationRequest) async throws -> Reservation
    func cancelReservation(id: String) async throws
}



