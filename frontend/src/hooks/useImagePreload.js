import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for preloading images
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {{ isLoaded: boolean, loadedCount: number, errors: string[] }}
 */
export const useImagePreload = (imageUrls = []) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [errors, setErrors] = useState([]);
  const preloadedImagesRef = useRef(new Map());
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoaded(true);
      return;
    }

    // Reset state
    setIsLoaded(false);
    setLoadedCount(0);
    setErrors([]);
    cancelledRef.current = false;

    // Filter out null/undefined/empty URLs
    const validUrls = imageUrls.filter(url => url && typeof url === 'string' && url.trim() !== '');
    
    if (validUrls.length === 0) {
      setIsLoaded(true);
      return;
    }

    let completedCount = 0;
    const imagePromises = [];
    const newErrors = [];

    validUrls.forEach((url) => {
      // Check if already preloaded
      if (preloadedImagesRef.current.has(url)) {
        completedCount++;
        if (completedCount === validUrls.length) {
          setIsLoaded(true);
          setLoadedCount(completedCount);
        }
        return;
      }

      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          if (!cancelledRef.current) {
            preloadedImagesRef.current.set(url, img);
            completedCount++;
            setLoadedCount(completedCount);
            
            if (completedCount === validUrls.length) {
              setIsLoaded(true);
            }
            resolve(url);
          }
        };

        img.onerror = () => {
          if (!cancelledRef.current) {
            newErrors.push(url);
            completedCount++;
            setLoadedCount(completedCount);
            setErrors([...newErrors]);
            
            if (completedCount === validUrls.length) {
              setIsLoaded(true);
            }
            reject(new Error(`Failed to load image: ${url}`));
          }
        };

        img.src = url;
      });

      imagePromises.push(promise);
    });

    // Cleanup function
    return () => {
      cancelledRef.current = true;
    };
  }, [imageUrls.join(',')]); // Re-run when URLs change

  return { isLoaded, loadedCount, errors };
};

/**
 * Hook for preloading a single image
 * @param {string} imageUrl - Image URL to preload
 * @returns {{ isLoaded: boolean, error: Error | null }}
 */
export const useImagePreloadSingle = (imageUrl) => {
  const result = useImagePreload(imageUrl ? [imageUrl] : []);
  return {
    isLoaded: result.isLoaded,
    error: result.errors.length > 0 ? new Error(result.errors[0]) : null,
  };
};

