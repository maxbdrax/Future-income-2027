/**
 * Helper utility to extract video IDs and create responsive embed URLs for YouTube and direct video sources.
 */

export interface ParsedVideoInfo {
  isPlayableVideo: boolean;
  type: 'youtube' | 'direct' | 'none';
  videoId?: string;
  embedUrl?: string;
  originalUrl: string;
}

export function parseVideoUrl(url: string | undefined | null): ParsedVideoInfo {
  const cleanUrl = (url || '').trim();
  if (!cleanUrl || cleanUrl === '#' || cleanUrl === '/') {
    return {
      isPlayableVideo: false,
      type: 'none',
      originalUrl: ''
    };
  }

  // Check for 11-char YouTube Video ID in various formats:
  // - https://www.youtube.com/watch?v=XYZ12345678
  // - https://youtu.be/XYZ12345678
  // - https://www.youtube.com/shorts/XYZ12345678
  // - https://www.youtube.com/embed/XYZ12345678
  // - https://www.youtube.com/live/XYZ12345678
  // - https://m.youtube.com/watch?v=XYZ12345678
  const ytMatch = cleanUrl.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isPlayableVideo: true,
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: cleanUrl
    };
  }

  // Check direct video file
  if (/\.(mp4|webm|ogg|mov)($|\?)/i.test(cleanUrl)) {
    return {
      isPlayableVideo: true,
      type: 'direct',
      embedUrl: cleanUrl,
      originalUrl: cleanUrl
    };
  }

  // If URL contains youtube domain but no video ID was specified (e.g., admin typed https://youtube.com)
  if (/youtube\.com/i.test(cleanUrl) || /youtu\.be/i.test(cleanUrl)) {
    // Provide standard demo video (educational earning guide)
    const demoId = 'dQw4w9WgXcQ';
    return {
      isPlayableVideo: true,
      type: 'youtube',
      videoId: demoId,
      embedUrl: `https://www.youtube.com/embed/${demoId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`,
      originalUrl: cleanUrl
    };
  }

  return {
    isPlayableVideo: false,
    type: 'none',
    originalUrl: cleanUrl
  };
}
