//
//  CachedAsyncImage.swift
//  ReservationApp
//
//  Created by Mehmet Ali Kısacık on 13.11.2025.
//

import SwiftUI

struct CachedAsyncImage<Content: View, Placeholder: View>: View {
    let url: URL?
    let content: (Image) -> Content
    let placeholder: () -> Placeholder
    
    @State private var image: UIImage?
    @State private var isLoading = true
    
    init(
        url: URL?,
        @ViewBuilder content: @escaping (Image) -> Content,
        @ViewBuilder placeholder: @escaping () -> Placeholder
    ) {
        self.url = url
        self.content = content
        self.placeholder = placeholder
    }
    
    var body: some View {
        Group {
            if let image = image {
                content(Image(uiImage: image))
            } else {
                placeholder()
            }
        }
        .task {
            await loadImage()
        }
        .onChange(of: url) { newUrl in
            Task {
                await loadImage()
            }
        }
    }
    
    private func loadImage() async {
        guard let url = url else {
            await MainActor.run {
                self.image = nil
                self.isLoading = false
            }
            return
        }
        
        // Check cache first
        if let cachedImage = await ImageCacheService.shared.getImage(for: url) {
            await MainActor.run {
                self.image = cachedImage
                self.isLoading = false
            }
            return
        }
        
        // Download from network
        await MainActor.run {
            self.isLoading = true
        }
        
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            
            guard let downloadedImage = UIImage(data: data) else {
                await MainActor.run {
                    self.image = nil
                    self.isLoading = false
                }
                return
            }
            
            // Store in cache
            await ImageCacheService.shared.storeImage(downloadedImage, for: url)
            
            // Update UI
            await MainActor.run {
                self.image = downloadedImage
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                self.image = nil
                self.isLoading = false
            }
        }
    }
}

