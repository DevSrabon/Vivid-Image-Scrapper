import { useState, useEffect, lazy, Suspense } from 'react';
import { AlertCircle } from 'lucide-react';
import { useImages } from './hooks/useImages';
import { downloadSingle, downloadMultiple } from './utils/download';

import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ControlsBar } from './components/ControlsBar';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';

import type { ImageData } from './types';
import './index.css';

const ImageCard = lazy(() => import('./components/ImageCard').then(m => ({ default: m.ImageCard })));

function App() {
  const [query, setQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });
  const [limit, setLimit] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const savedLimit = params.get('limit');
    return savedLimit ? parseInt(savedLimit) : 20;
  });
  const [downloading, setDownloading] = useState(false);
  const [downloadAsZip, setDownloadAsZip] = useState(true);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const { images, loading, error, searchImages, toggleSelect, toggleSelectAll } = useImages();

  useEffect(() => {
    if (query) {
      searchImages(query, limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('limit', limit.toString());
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    searchImages(query, limit);
  };

  const handleDownloadSingle = async (img: ImageData, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await downloadSingle(img);
    } catch (err) {
      console.error("Failed to download individual image:", err);
      alert("Failed to download this image.");
    }
  };

  const handleView = (img: ImageData, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewingImage(img.url);
  };

  const handleDownloadSelected = async () => {
    const selectedImages = images.filter(img => img.selected);
    if (selectedImages.length === 0) return;
    
    setDownloading(true);
    try {
      await downloadMultiple(selectedImages, query, downloadAsZip);
    } catch (err) {
      console.error("Failed to bulk download:", err);
      alert("Error downloading images.");
    } finally {
      setDownloading(false);
    }
  };

  const selectedCount = images.filter(img => img.selected).length;

  return (
    <div className="container">
      <Header />

      <SearchForm 
        query={query} setQuery={setQuery}
        limit={limit} setLimit={setLimit}
        loading={loading} onSearch={handleSearch}
      />

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <ControlsBar 
        selectedCount={selectedCount}
        totalCount={images.length}
        downloading={downloading}
        downloadAsZip={downloadAsZip}
        setDownloadAsZip={setDownloadAsZip}
        onToggleSelectAll={toggleSelectAll}
        onDownload={handleDownloadSelected}
      />

      <main style={{ flex: 1 }}>
        {loading ? (
          <div className="gallery">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="gallery">
            <Suspense fallback={null}>
              {images.map(img => (
                <ImageCard 
                  key={img.id}
                  img={img}
                  onSelect={toggleSelect}
                  onDownloadSingle={handleDownloadSingle}
                  onView={handleView}
                />
              ))}
            </Suspense>
          </div>
        ) : !loading && !error && (
          <EmptyState />
        )}
      </main>

      <Footer />

      {viewingImage && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, 
            backgroundColor: 'rgba(0,0,0,0.9)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setViewingImage(null)}
        >
          <button 
            style={{
              position: 'absolute', top: '1rem', right: '1.5rem',
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)',
              fontSize: '3rem', cursor: 'pointer', padding: '0.5rem',
              lineHeight: 1
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onClick={() => setViewingImage(null)}
          >
            &times;
          </button>
          <img 
            src={viewingImage} 
            alt="Expanded view" 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '0.5rem' }} 
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
}

export default App;
