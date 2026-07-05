import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = '📭',
  title = 'No data found',
  text = 'There are no records matching your criteria.',
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{text}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary" aria-label={actionLabel}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button className="btn btn-primary" onClick={onAction} aria-label={actionLabel}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
