import { useId } from 'react';

const SERVICE_TYPES = [
  { value: 'all',          label: 'All Services' },
  { value: 'oil_change',   label: 'Oil Change' },
  { value: 'brake_repair', label: 'Brake Repair' },
  { value: 'tire_rotation',label: 'Tire Rotation' },
  { value: 'engine_check', label: 'Engine Check' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'battery',      label: 'Battery' },
  { value: 'ac_repair',    label: 'A/C Repair' },
  { value: 'inspection',   label: 'Inspection' },
  { value: 'other',        label: 'Other' },
];

const STATUSES = [
  { value: 'all',         label: 'All Statuses' },
  { value: 'pending',     label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'cancelled',   label: 'Cancelled' },
];

const PRIORITIES = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'low',    label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high',   label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function FilterBar({ filters, onChange }) {
  const statusId   = useId();
  const serviceId  = useId();
  const priorityId = useId();

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }} role="group" aria-label="Filter bookings">
      <div>
        <label htmlFor={statusId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
          Status filter
        </label>
        <select
          id={statusId}
          className="filter-select"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={serviceId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
          Service filter
        </label>
        <select
          id={serviceId}
          className="filter-select"
          value={filters.serviceType}
          onChange={(e) => onChange({ ...filters, serviceType: e.target.value })}
          aria-label="Filter by service type"
        >
          {SERVICE_TYPES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={priorityId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
          Priority filter
        </label>
        <select
          id={priorityId}
          className="filter-select"
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          aria-label="Filter by priority"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export { SERVICE_TYPES, STATUSES, PRIORITIES };
