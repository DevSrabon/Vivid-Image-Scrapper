import { Download, Loader2 } from 'lucide-react';

interface Props {
  selectedCount: number;
  totalCount: number;
  downloading: boolean;
  downloadAsZip: boolean;
  setDownloadAsZip: (val: boolean) => void;
  onToggleSelectAll: () => void;
  onDownload: () => void;
}

export const ControlsBar = ({ 
  selectedCount, totalCount, downloading, 
  downloadAsZip, setDownloadAsZip, 
  onToggleSelectAll, onDownload 
}: Props) => {
  if (totalCount === 0) return null;

  return (
    <div className="controls-bar">
      <div className="controls-left">
        <label className="checkbox-wrapper">
          <input 
            type="checkbox" 
            className="custom-checkbox"
            checked={totalCount > 0 && selectedCount === totalCount}
            onChange={onToggleSelectAll}
          />
          Select All
        </label>
        <span className="selected-count">
          {selectedCount} selected
        </span>
      </div>
      <div className="controls-right">
        {selectedCount > 1 && (
          <label className="checkbox-wrapper" style={{ marginRight: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <input 
              type="checkbox" 
              className="custom-checkbox"
              checked={downloadAsZip}
              onChange={(e) => setDownloadAsZip(e.target.checked)}
            />
            Zip files
          </label>
        )}
        <button 
          className="btn" 
          onClick={onDownload}
          disabled={selectedCount === 0 || downloading}
        >
          {downloading ? <Loader2 className="spinner" /> : <Download size={20} />}
          {downloading ? 'Downloading...' : 'Download Selected'}
        </button>
      </div>
    </div>
  );
};
