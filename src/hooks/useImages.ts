import { useState } from 'react';
import type { ImageData } from '../types';
import { fetchImagesFromBing } from '../utils/api';

export const useImages = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchImages = async (query: string, limit: number) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setImages([]);

    try {
      const results = await fetchImagesFromBing(query, limit);
      if (results.length === 0) {
        setError("No images found. Please try a different query.");
      } else {
        setImages(results);
      }
    } catch (err) {
      setError("Failed to fetch images. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, selected: !img.selected } : img
    ));
  };

  const toggleSelectAll = () => {
    const allSelected = images.every(img => img.selected);
    setImages(prev => prev.map(img => ({ ...img, selected: !allSelected })));
  };

  return {
    images,
    loading,
    error,
    searchImages,
    toggleSelect,
    toggleSelectAll
  };
};
