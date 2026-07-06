import { useEffect, useRef } from 'react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
  isLoading = false,
}) {
  const cancelRef = useRef(null);
  const modalRef = useRef(null);

  // Focus trap & initial focus
  useEffect(() => {
    if (isOpen && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    modal.addEventListener('keydown', trap);
    return () => modal.removeEventListener('keydown', trap);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div className="modal" ref={modalRef}>

        <h2 className="modal-title" id="modal-title">{title}</h2>
        <p className="modal-text" id="modal-desc">{message}</p>
        <div className="modal-actions">
          <button
            ref={cancelRef}
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
          <button
            className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
            aria-label={confirmLabel}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner spinner-sm" aria-hidden="true" />
                Deleting…
              </>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
