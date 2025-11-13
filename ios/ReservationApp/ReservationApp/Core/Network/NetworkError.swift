//
//  NetworkError.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

enum NetworkError: LocalizedError {
    case invalidURL
    case noData
    case decodingError(Error)
    case serverError(Int, String?)
    case unauthorized
    case networkError(Error)
    case timeout
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Geçersiz URL"
        case .noData:
            return "Veri alınamadı"
        case .decodingError(let error):
            return "Veri çözümlenemedi: \(error.localizedDescription)"
        case .serverError(let code, let message):
            return message ?? "Sunucu hatası: \(code)"
        case .unauthorized:
            return "Yetkisiz erişim. Lütfen tekrar giriş yapın."
        case .networkError(let error):
            return "Ağ hatası: \(error.localizedDescription)"
        case .timeout:
            return "İstek zaman aşımına uğradı. Lütfen tekrar deneyin."
        case .unknown:
            return "Bilinmeyen bir hata oluştu"
        }
    }
}

