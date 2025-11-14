//
//  ImageCacheService.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import Foundation
import UIKit

actor ImageCacheService {
    nonisolated static let shared = ImageCacheService()
    
    private let memoryCache: NSCache<NSString, UIImage>
    private let cacheDirectory: URL
    private let maxMemoryCacheCount = 100
    private let maxDiskCacheSize: Int64 = 200 * 1024 * 1024
    
    nonisolated private init() {
        let cache = NSCache<NSString, UIImage>()
        cache.countLimit = 100
        cache.totalCostLimit = 50 * 1024 * 1024
        self.memoryCache = cache
        
        let fileManager = FileManager.default
        let urls = fileManager.urls(for: .cachesDirectory, in: .userDomainMask)
        guard let cacheURL = urls.first else {
            fatalError("Unable to access cache directory")
        }
        
        let imageCacheURL = cacheURL.appendingPathComponent("ImageCache", isDirectory: true)
        self.cacheDirectory = imageCacheURL
        
        if !fileManager.fileExists(atPath: imageCacheURL.path) {
            try? fileManager.createDirectory(at: imageCacheURL, withIntermediateDirectories: true)
        }
    }
    
    // MARK: - Public Methods
    
    /// Get image from cache (memory first, then disk)
    func getImage(for url: URL) async -> UIImage? {
        let key = cacheKey(for: url)
        
        if let cachedImage = memoryCache.object(forKey: key as NSString) {
            return cachedImage
        }
        
        return await loadFromDisk(key: key)
    }
    
    /// Store image in both memory and disk cache
    func storeImage(_ image: UIImage, for url: URL) async {
        let key = cacheKey(for: url)
        
        let cost = Int(image.size.width * image.size.height * 4)
        memoryCache.setObject(image, forKey: key as NSString, cost: cost)
        
        await saveToDisk(image: image, key: key)
        await enforceDiskCacheLimit()
    }
    
    /// Clear all caches
    func clearCache() async {
        memoryCache.removeAllObjects()
        
        let fileManager = FileManager.default
        if let files = try? fileManager.contentsOfDirectory(at: cacheDirectory, includingPropertiesForKeys: nil) {
            for file in files {
                try? fileManager.removeItem(at: file)
            }
        }
    }
    
    /// Clear cache for specific URL
    func removeImage(for url: URL) async {
        let key = cacheKey(for: url)
        
        memoryCache.removeObject(forKey: key as NSString)
        
        let fileURL = cacheDirectory.appendingPathComponent(key)
        try? FileManager.default.removeItem(at: fileURL)
    }
    
    // MARK: - Private Methods
    
    private func cacheKey(for url: URL) -> String {
        let urlString = url.absoluteString
        let sanitized = urlString
            .replacingOccurrences(of: "://", with: "_")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "?", with: "_")
            .replacingOccurrences(of: "&", with: "_")
            .replacingOccurrences(of: "=", with: "_")
            .replacingOccurrences(of: " ", with: "_")
        
        let hash = urlString.hash
        return "\(hash)_\(sanitized)".replacingOccurrences(of: "[^a-zA-Z0-9_-]", with: "", options: .regularExpression)
    }
    
    private func loadFromDisk(key: String) async -> UIImage? {
        let fileURL = cacheDirectory.appendingPathComponent(key)
        
        guard FileManager.default.fileExists(atPath: fileURL.path) else {
            return nil
        }
        
        guard let data = try? Data(contentsOf: fileURL),
              let image = UIImage(data: data) else {
            return nil
        }
        
        let cost = Int(image.size.width * image.size.height * 4)
        memoryCache.setObject(image, forKey: key as NSString, cost: cost)
        
        return image
    }
    
    private func saveToDisk(image: UIImage, key: String) async {
        guard let data = image.jpegData(compressionQuality: 0.8) else {
            return
        }
        
        let fileURL = cacheDirectory.appendingPathComponent(key)
        try? data.write(to: fileURL)
    }
    
    private func enforceDiskCacheLimit() async {
        let fileManager = FileManager.default
        
        guard let files = try? fileManager.contentsOfDirectory(at: cacheDirectory, includingPropertiesForKeys: [.fileSizeKey, .contentModificationDateKey]) else {
            return
        }
        
        var totalSize: Int64 = 0
        var fileInfos: [(url: URL, size: Int64, date: Date)] = []
        
        for file in files {
            guard let attributes = try? fileManager.attributesOfItem(atPath: file.path),
                  let size = attributes[.size] as? Int64,
                  let date = attributes[.modificationDate] as? Date else {
                continue
            }
            
            totalSize += size
            fileInfos.append((url: file, size: size, date: date))
        }
        
        if totalSize > maxDiskCacheSize {
            fileInfos.sort { $0.date < $1.date }
            
            for fileInfo in fileInfos {
                try? fileManager.removeItem(at: fileInfo.url)
                totalSize -= fileInfo.size
                
                if totalSize <= maxDiskCacheSize {
                    break
                }
            }
        }
    }
}

