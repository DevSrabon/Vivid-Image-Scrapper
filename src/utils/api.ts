import type { ImageData } from '../types';

export const fetchImagesFromBing = async (query: string, limit: number): Promise<ImageData[]> => {
  const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
  const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(searchUrl)}`;
  
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("Network response was not ok");
  const text = await res.text();
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const elements = doc.querySelectorAll(".iusc");
  
  const urls: string[] = [];
  for (const el of elements) {
    try {
      const mAttr = el.getAttribute("m");
      if (mAttr) {
        const meta = JSON.parse(mAttr);
        if (meta.murl && !urls.includes(meta.murl)) {
          urls.push(meta.murl);
        }
      }
    } catch {
      // Ignore parse errors for individual nodes
    }
    if (urls.length >= limit) break;
  }
  
  return urls.map(url => ({ 
    id: Math.random().toString(36).substring(2, 9), 
    url, 
    selected: false 
  }));
};
