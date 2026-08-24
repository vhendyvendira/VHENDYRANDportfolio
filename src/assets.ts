import { CASE_STUDIES } from './constants';

export const CRITICAL_IMAGES = [
  // Intro / Hero images
  '/favicon.svg',
  
  // Case Study Thumbnails
  ...CASE_STUDIES.map(cs => cs.image),
  
  // About Page Images
  'https://ik.imagekit.io/0ghhw9jvx/about-page-images/google-singapore-2022.png',
  
  // Presence Page Images
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/iddr-apple-event-2025.png',
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/uix-mentor-binaracademy-2022.png',
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-bali-airport-2025.jpeg',
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/pantai-melasti.jpeg',
  
  // Reel Images
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-with-angga-iqbal-jogja.jpg',
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-hafidz.png',
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-on-kanvas-confrence.png',
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-femmy-nabila.jpeg',
  'https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-andrew-singapore.jpg',

  // Learning Section Logos
  "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/google-logo.png",
  "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/ibm-logo.png",
  "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/mckinsey-&-company.png",
  "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/anthropic-logo.png",
  "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/rws-group.png"
];

export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => {
      console.warn(`Failed to load image: ${url}`);
      resolve(); // Still resolve to not block the app indefinitely
    };
  });
}

export function preloadAllAssets(urls: string[], onProgress?: (progress: number) => void): Promise<void> {
  let loadedCount = 0;
  const total = urls.length;
  
  if (total === 0) return Promise.resolve();
  
  return new Promise((resolve) => {
    urls.forEach((url) => {
      preloadImage(url).finally(() => {
        loadedCount++;
        onProgress?.(loadedCount / total);
        if (loadedCount === total) {
          resolve();
        }
      });
    });
  });
}
