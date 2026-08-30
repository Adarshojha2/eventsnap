import { FolderOpen } from 'lucide-react';

const EmptyState = ({ title = 'No items found', description = 'Try adjusting your search or filters.', actionButton = null }) => {
  return (
    <div className="empty-state shadow-sm border rounded-es bg-white my-4">
      <div className="empty-state-icon">
        <FolderOpen size={48} color="#6C63FF" style={{ opacity: 0.7 }} />
      </div>
      <h5 className="fw-bold text-dark">{title}</h5>
      <p className="text-muted small mx-auto" style={{ maxWidth: 360 }}>{description}</p>
      {actionButton && <div className="mt-3">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
