/**
 * Utility functions for working with booking data
 */

export const SERVICE_LABELS = {
  oil_change:   'Oil Change',
  brake_repair: 'Brake Repair',
  tire_rotation:'Tire Rotation',
  engine_check: 'Engine Check',
  transmission: 'Transmission',
  battery:      'Battery',
  ac_repair:    'A/C Repair',
  inspection:   'Full Inspection',
  other:        'Other',
};

export const STATUS_LABELS = {
  pending:     'Pending',
  in_progress: 'In Progress',
  completed:   'Completed',
  cancelled:   'Cancelled',
};

export const PRIORITY_COLORS = {
  low:    'var(--priority-low)',
  normal: 'var(--priority-normal)',
  high:   'var(--priority-high)',
  urgent: 'var(--priority-urgent)',
};

export const formatDate = (date, includeTime = false) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return new Date(date).toLocaleString('en-IN', options);
};

export const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const getVehicleLabel = (booking) =>
  `${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}`;
