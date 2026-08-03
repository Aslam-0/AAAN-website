/**
 * AAAN Enterprises — High-Performance Image Optimizer & CDN Pipeline
 * Optimizes image URLs on-the-fly for sub-50ms render speed!
 */

export function getOptimizedImageUrl(url, width = 400, quality = 75) {
  if (!url) return '/aaan-logo.svg';

  // Unsplash image optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('w', String(width));
      parsed.searchParams.set('q', String(quality));
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      return parsed.toString();
    } catch {
      return url;
    }
  }

  // Cloudinary image optimization
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }

  return url;
}
