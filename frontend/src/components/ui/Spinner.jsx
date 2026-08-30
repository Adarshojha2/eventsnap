const Spinner = ({ size = 24, color = '#6C63FF' }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid rgba(108, 99, 255, 0.15)`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;
