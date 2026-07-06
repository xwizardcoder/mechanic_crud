import { useId } from 'react';

const SORT_OPTIONS = [
  { value: 'createdAt:desc',  label: 'Newest First' },
  { value: 'createdAt:asc',   label: 'Oldest First' },
  { value: 'customerName:asc',label: 'Name A → Z' },
  { value: 'priority:desc',   label: 'Priority (High → Low)' },
  { value: 'vehicleYear:desc',label: 'Vehicle Year (New → Old)' },
  { value: 'estimatedCost:desc', label: 'Cost (High → Low)' },
];

export default function SortBar({ value, onChange }) {
  const sortId = useId();

  const handleChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    onChange({ sortBy, sortOrder });
  };

  return (
    <div>
      <label
        htmlFor={sortId}
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}
      >
        Sort bookings
      </label>
      <select
        id={sortId}
        className="filter-select"
        value={value}
        onChange={handleChange}
        aria-label="Sort bookings by"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
