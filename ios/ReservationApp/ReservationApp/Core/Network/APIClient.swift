//
//  APIClient.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import Combine

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
        configuration.timeoutIntervalForRequest = 60
        configuration.timeoutIntervalForResource = 120
        self.session = URLSession(configuration: configuration)
    }
    
    func request<T: Decodable>(
        endpoint: APIEndpoint,
        method: String? = nil,
        body: Encodable? = nil,
        queryParams: [String: String]? = nil,
        responseType: T.Type
    ) async throws -> T {
        var urlComponents = URLComponents(string: baseURL + endpoint.path)
        
        if let queryParams = queryParams {
            urlComponents?.queryItems = queryParams.map {
                URLQueryItem(name: $0.key, value: $0.value)
            }
        }
        
        guard let url = urlComponents?.url else {
            throw NetworkError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method ?? endpoint.method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = keychainManager.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
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
            
            if httpResponse.statusCode == 401 {
                keychainManager.deleteToken()
                AuthStateManager.shared.clearUser()
                onUnauthorized?()
                throw NetworkError.unauthorized
            }
            
            guard (200...299).contains(httpResponse.statusCode) else {
                let errorMessage = try? JSONDecoder().decode([String: String].self, from: data)
                throw NetworkError.serverError(httpResponse.statusCode, errorMessage?["message"])
            }
            
            guard !data.isEmpty else {
                if T.self == EmptyResponse.self {
                    return EmptyResponse() as! T
                }
                throw NetworkError.noData
            }
            
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
        } catch let urlError as URLError {
            if urlError.code == .timedOut {
                throw NetworkError.timeout
            }
            throw NetworkError.networkError(urlError)
        } catch {
            throw NetworkError.networkError(error)
        }
    }
}

struct EmptyResponse: Codable {}

