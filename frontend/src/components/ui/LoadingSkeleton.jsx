const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (index) => {
    if (type === 'card') {
      return (
        <div key={index} className="es-card p-0 mb-4" style={{ border: '1px solid #e8e8f0' }}>
          <div className="skeleton" style={{ height: 160, borderRadius: '16px 16px 0 0' }} />
          <div className="p-3">
            <div className="skeleton mb-2" style={{ height: 20, width: '70%' }} />
            <div className="skeleton mb-3" style={{ height: 14, width: '40%' }} />
            <div className="d-flex gap-3 pt-2 border-top">
              <div className="skeleton" style={{ height: 20, width: 40 }} />
              <div className="skeleton" style={{ height: 20, width: 40 }} />
              <div className="skeleton ms-auto" style={{ height: 20, width: 60 }} />
            </div>
          </div>
        </div>
      );
    }

    if (type === 'gallery') {
      return (
        <div key={index} className="gallery-item skeleton" style={{ height: 200, borderRadius: 10, width: '100%', marginBottom: 12 }} />
      );
    }

    return null;
  };

  return (
    <div className={type === 'card' ? 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4' : 'd-flex flex-wrap gap-2'}>
      {Array.from({ length: count }).map((_, idx) => (
        type === 'card' ? (
          <div className="col" key={idx}>
            {renderSkeleton(idx)}
          </div>
        ) : renderSkeleton(idx)
      ))}
    </div>
  );
};

export default LoadingSkeleton;
