const STATUS_CONFIG = {
  pending:     { label: 'Pending',     icon: '⏳' },
  in_progress: { label: 'In Progress', icon: '🔧' },
  completed:   { label: 'Completed',   icon: '✅' },
  cancelled:   { label: 'Cancelled',   icon: '✗' },
};

const PRIORITY_CONFIG = {
  low:    { label: 'Low',    icon: '↓' },
  normal: { label: 'Normal', icon: '→' },
  high:   { label: 'High',   icon: '↑' },
  urgent: { label: 'Urgent', icon: '‼' },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, icon: '?' };
  return (
    <span
      className={`badge badge-${status}`}
      aria-label={`Status: ${config.label}`}
      role="status"
    >
      <span className="badge-dot" aria-hidden="true" />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || { label: priority, icon: '' };
  return (
    <span
      className={`badge badge-${priority}`}
      aria-label={`Priority: ${config.label}`}
    >
      {config.label}
    </span>
  );
}

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

export const PRIORITY_OPTIONS = Object.entries(PRIORITY_CONFIG).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));
