import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ImageData } from '../types';

const downloadFile = async (url: string, filename: string) => {
  const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`);
  const blob = await res.blob();
  saveAs(blob, filename);
};

export const downloadSingle = async (img: ImageData) => {
  const ext = img.url.split('.').pop()?.split('?')[0] || "jpg";
  const cleanExt = ext.length > 4 ? "jpg" : ext;
  await downloadFile(img.url, `image-${img.id}.${cleanExt}`);
};

export const downloadMultiple = async (images: ImageData[], query: string, asZip: boolean) => {
  if (images.length === 0) return;

  if (images.length === 1) {
    await downloadSingle(images[0]);
    return;
  }

  if (!asZip) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const ext = img.url.split('.').pop()?.split('?')[0] || "jpg";
      const cleanExt = ext.length > 4 ? "jpg" : ext;
      await downloadFile(img.url, `${query.replace(/\s+/g, '_')}-${i + 1}-${img.id}.${cleanExt}`);
      await new Promise(r => setTimeout(r, 400));
    }
  } else {
    const zip = new JSZip();
    await Promise.all(images.map(async (img, idx) => {
      try {
        const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(img.url)}`);
        const blob = await res.blob();
        const ext = img.url.split('.').pop()?.split('?')[0] || "jpg";
        const cleanExt = ext.length > 4 ? "jpg" : ext;
        zip.file(`${query.replace(/\s+/g, '_')}-${idx + 1}.${cleanExt}`, blob);
      } catch {
        console.error("Failed to add image to zip", img.url);
      }
    }));
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${query.replace(/\s+/g, '_')}_images.zip`);
  }
};
