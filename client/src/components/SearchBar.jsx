import { useId } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search bookings…' }) {
  const inputId = useId();

  return (
    <div className="search-wrapper">
      <label htmlFor={inputId} className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        {placeholder}
      </label>
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        id={inputId}
        type="search"
        className="search-input"
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
