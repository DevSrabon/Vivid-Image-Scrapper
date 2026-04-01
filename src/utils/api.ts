import type { ImageData } from '../types';

export const fetchImagesFromBing = async (query: string, limit: number): Promise<ImageData[]> => {
  const urls: string[] = [];
  let first = 1;
  const maxPages = Math.ceil(limit / 35) + 1;
  let currentPages = 0;

  while (urls.length < limit && currentPages < maxPages) {
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=${first}`;
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(searchUrl)}`;
    
    try {
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      const text = await res.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const elements = doc.querySelectorAll(".iusc");
      
      let addedCount = 0;
      for (const el of elements) {
        if (urls.length >= limit) break;
        try {
          const mAttr = el.getAttribute("m");
          if (mAttr) {
            const meta = JSON.parse(mAttr);
            if (meta.murl && !urls.includes(meta.murl)) {
              urls.push(meta.murl);
              addedCount++;
            }
          }
        } catch {
        }
      }
      
      if (addedCount === 0) break;
      
      first += 35;
      currentPages++;
    } catch (err) {
      console.error("Pagination fetch error:", err);
      break; 
    }
  }
  
  return urls.map(url => ({ 
    id: Math.random().toString(36).substring(2, 9), 
    url, 
    selected: false 
  }));
};
