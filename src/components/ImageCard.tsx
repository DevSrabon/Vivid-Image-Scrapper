import { memo } from 'react';
import { CheckSquare, ImageDown, Eye } from 'lucide-react';
import type { ImageData } from '../types';

interface Props {
  img: ImageData;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onDownloadSingle: (img: ImageData, e: React.MouseEvent) => void;
  onView: (img: ImageData, e: React.MouseEvent) => void;
}

export const ImageCard = memo(({ img, onSelect, onDownloadSingle, onView }: Props) => (
  <div 
    className={`image-card ${img.selected ? 'selected' : ''}`}
    onClick={(e) => onSelect(img.id, e)}
  >
    <div className="checkbox-overlay">
      {img.selected ? 
        <CheckSquare fill="#6366f1" size={24} color="white" /> : 
        <div style={{width: 24, height: 24, padding: 2}}>
          <div style={{width: 20, height: 20, border: '2px solid rgba(255,255,255,0.7)', borderRadius: 4}} />
        </div>
      }
    </div>
    
    <img 
      src={img.url} 
      alt="Scraped content" 
      className="image" 
      loading="lazy"
      referrerPolicy="no-referrer"
    />

    <div className="action-overlay">
      <button 
        className="icon-btn" 
        title="View large image"
        onClick={(e) => {
          e.stopPropagation();
          onView(img, e);
        }}
      >
        <Eye size={18} />
      </button>
      <button 
        className="icon-btn" 
        title="Download individual"
        onClick={(e) => {
          e.stopPropagation();
          onDownloadSingle(img, e);
        }}
      >
        <ImageDown size={18} />
      </button>
    </div>
  </div>
));
