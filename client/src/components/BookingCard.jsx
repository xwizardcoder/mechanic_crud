import { Link } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './StatusBadge';

const PRIORITY_COLORS = {
  low:    'var(--priority-low)',
  normal: 'var(--priority-normal)',
  high:   'var(--priority-high)',
  urgent: 'var(--priority-urgent)',
};

const SERVICE_LABELS = {
  oil_change:   'Oil Change',
  brake_repair: 'Brake Repair',
  tire_rotation:'Tire Rotation',
  engine_check: 'Engine Check',
  transmission: 'Transmission',
  battery:      'Battery',
  ac_repair:    'A/C Repair',
  inspection:   'Inspection',
  other:        'Other',
};

export default function BookingCard({ booking, onDelete }) {
  const createdAt = new Date(booking.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <article
      className="booking-card"
      style={{ '--priority-color': PRIORITY_COLORS[booking.priority] }}
      aria-label={`Booking for ${booking.customerName}`}
    >
      <div className="booking-card-top">
        <div>
          <div className="booking-customer-name">{booking.customerName}</div>
          <div className="booking-vehicle">
            🚗 {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
          </div>
        </div>
        <div className="booking-card-badges">
          <StatusBadge status={booking.status} />
          <PriorityBadge priority={booking.priority} />
        </div>
      </div>

      <div className="booking-card-details">
        <div className="booking-detail-row">
          <span className="booking-detail-icon" aria-hidden="true">🛠️</span>
          <span>{SERVICE_LABELS[booking.serviceType] || booking.serviceType}</span>
        </div>
        <div className="booking-detail-row">
          <span className="booking-detail-icon" aria-hidden="true">👨‍🔧</span>
          <span>{booking.assignedMechanic}</span>
        </div>
        {booking.customerPhone && (
          <div className="booking-detail-row">
            <span className="booking-detail-icon" aria-hidden="true">📞</span>
            <span>{booking.customerPhone}</span>
          </div>
        )}
        {booking.description && (
          <div className="booking-detail-row">
            <span className="booking-detail-icon" aria-hidden="true">📝</span>
            <span style={{ color: 'var(--color-400)', fontStyle: 'italic' }}>
              {booking.description.length > 80
                ? `${booking.description.slice(0, 80)}…`
                : booking.description}
            </span>
          </div>
        )}
      </div>

      <div className="booking-card-footer">
        <span>{createdAt}</span>
        {booking.estimatedCost != null && (
          <span className="booking-cost">
            ₹{Number(booking.estimatedCost).toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <div className="card-footer">
        <div className="flex gap-2">
          <Link
            to={`/bookings/${booking._id}`}
            className="btn btn-ghost btn-sm"
            aria-label={`View details for ${booking.customerName}`}
          >
            👁 View
          </Link>
          <Link
            to={`/bookings/${booking._id}/edit`}
            className="btn btn-secondary btn-sm"
            aria-label={`Edit booking for ${booking.customerName}`}
          >
            ✏️ Edit
          </Link>
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(booking)}
          aria-label={`Delete booking for ${booking.customerName}`}
        >
          🗑 Delete
        </button>
      </div>
    </article>
  );
}
