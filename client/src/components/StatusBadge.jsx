const STATUS_CONFIG = {
  pending: { label: 'Pending' },
  in_progress: { label: 'In Progress' },
  completed: { label: 'Completed' },
  cancelled: { label: 'Cancelled' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low' },
  normal: { label: 'Normal' },
  high: { label: 'High' },
  urgent: { label: 'Urgent' },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status };
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" aria-hidden="true" />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || { label: priority };
  return (
    <span className={`badge badge-${priority}`}>
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
