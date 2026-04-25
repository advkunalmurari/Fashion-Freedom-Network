/**
 * Utility function to optimize Unsplash URLs by adding compression, 
 * format selection, and sizing parameters.
 */
export const optimizeUnsplash = (url: string, { width = 800, quality = 80 } = {}) => {
  if (!url || !url.includes('unsplash.com')) return url;
  
  // Remove existing params
  const pureUrl = url.split('?')[0];
  
  // Add performance-enhancing params
  return `${pureUrl}?auto=format,compress&q=${quality}&w=${width}&fm=webp`;
};

/**
 * Generates a srcset string for an Unsplash image at multiple common widths.
 */
export const generateUnsplashSrcSet = (url: string) => {
  if (!url || !url.includes('unsplash.com')) return undefined;
  
  const widths = [400, 800, 1200, 1600];
  return widths
    .map(w => `${optimizeUnsplash(url, { width: w })} ${w}w`)
    .join(', ');
};
