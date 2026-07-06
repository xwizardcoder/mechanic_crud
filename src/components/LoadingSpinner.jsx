export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';

  return (
    <div className="spinner-overlay" role="status" aria-live="polite" aria-label={text}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div className={`spinner ${sizeClass}`} aria-hidden="true" />
        {text && <p className="loading-text" aria-hidden="true">{text}</p>}
      </div>
    </div>
  );
}
