import { useId } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search bookings…' }) {
  const inputId = useId();

  return (
    <div className="search-wrapper">
      <label htmlFor={inputId} className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        {placeholder}
      </label>
      <input
        id={inputId}
        type="search"
        className="search-input"
        style={{ paddingLeft: 'var(--space-4)' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}
