import { Image as ImageIcon } from 'lucide-react';

export const EmptyState = () => (
  <div className="empty-state">
    <ImageIcon size={64} opacity={0.5} />
    <h2>No Images Yet</h2>
    <p>Enter a query above and discover beautiful images seamlessly.</p>
  </div>
);
