export default function StatsCard({ icon, value, label, color = 'var(--accent)' }) {
  return (
    <div
      className="stat-card"
      style={{ '--stat-color': color }}
      role="region"
      aria-label={`${label}: ${value}`}
    >
      {icon && <span className="stat-icon" aria-hidden="true">{icon}</span>}
      <div className="stat-value" aria-live="polite">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
