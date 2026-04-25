/**
 * Media Utilities for Fashion Freedom Network (FFN)
 * Specialized for high-performance image and video delivery
 */

/**
 * Optimizes an Unsplash URL by appending sizing and quality parameters.
 * Helps prevent loading massive images in small containers.
 */
export const optimizeUnsplashUrl = (url: string, width: number = 800, quality: number = 80): string => {
  if (!url.includes('images.unsplash.com')) return url;
  
  // Remove existing optimization parameters to avoid conflicts
  const baseUrl = url.split('?')[0];
  
  // High-performance parameters
  // q: quality, w: width, auto: format (selects webp/avif automatically), fit: crop
  return `${baseUrl}?q=${quality}&w=${width}&auto=format&fit=crop&ixlib=rb-4.0.3`;
};

/**
 * Generates a consistent placeholder URL for missing or loading assets
 */
export const getPlaceholderUrl = (text: string = 'FFN'): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=000&color=fff&size=256&bold=true`;
};

/**
 * Intelligent Media Kit link generator
 */
export const getMediaKitPreview = (userId: string): string => {
  return `/media-kit/${userId}/preview`;
};
