//
//  APIClient.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation

class APIClient {
    nonisolated static let shared = APIClient()
    
    private let baseURL: String
    private let session: URLSession
    private let keychainManager: KeychainManager
    
    var onUnauthorized: (() -> Void)?
    
    init(baseURL: String = AppConstants.API.baseURL, keychainManager: KeychainManager = KeychainManager.shared) {
        self.baseURL = baseURL
        self.keychainManager = keychainManager
        
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        self.session = URLSession(configuration: configuration)
    }
    
    func request<T: Decodable>(
        endpoint: APIEndpoint,
        method: String? = nil,
        body: Encodable? = nil,
        responseType: T.Type
    ) async throws -> T {
        guard let url = URL(string: baseURL + endpoint.path) else {
            throw NetworkError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method ?? endpoint.method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // Add authorization token if available
        if let token = keychainManager.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        // Add request body if provided
        if let body = body {
            do {
                request.httpBody = try JSONEncoder().encode(body)
            } catch {
                throw NetworkError.networkError(error)
            }
        }
        
        do {
            let (data, response) = try await session.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw NetworkError.unknown
            }
            
            // Handle 401 Unauthorized
            if httpResponse.statusCode == 401 {
                keychainManager.deleteToken()
                onUnauthorized?()
                throw NetworkError.unauthorized
            }
            
            // Handle other error status codes
            guard (200...299).contains(httpResponse.statusCode) else {
                let errorMessage = try? JSONDecoder().decode([String: String].self, from: data)
                throw NetworkError.serverError(httpResponse.statusCode, errorMessage?["message"])
            }
            
            // Handle empty response
            guard !data.isEmpty else {
                // For empty responses, return a simple success indicator if T is Codable
                if T.self == EmptyResponse.self {
                    return EmptyResponse() as! T
                }
                throw NetworkError.noData
            }
            
            // Decode response
            do {
                let decoder = JSONDecoder()
                decoder.keyDecodingStrategy = .convertFromSnakeCase
                decoder.dateDecodingStrategy = .iso8601
                return try decoder.decode(T.self, from: data)
            } catch {
                throw NetworkError.decodingError(error)
            }
        } catch let error as NetworkError {
            throw error
        } catch {
            throw NetworkError.networkError(error)
        }
    }
}

// Empty response type for endpoints that don't return data
struct EmptyResponse: Codable {}

