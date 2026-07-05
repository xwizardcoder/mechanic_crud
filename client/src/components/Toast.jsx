import { useEffect, useState } from 'react';

/**
 * Toast notification component — auto-dismisses after duration.
 * Supports: success, error, info types.
 */
export function Toast({ message, type = 'success', duration = 4000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // allow fade-out animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = { success: '✅', error: '⚠️', info: 'ℹ️' };

  return (
    <div
      className={`alert alert-${type === 'error' ? 'error' : 'success'}`}
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 2000,
        maxWidth: 380,
        boxShadow: 'var(--shadow-lg)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <span className="alert-icon" aria-hidden="true">{icons[type]}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="btn btn-ghost btn-icon btn-sm"
        aria-label="Dismiss notification"
        style={{ marginLeft: 8 }}
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Hook to manage toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const ToastContainer = () => (
    <div aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}
