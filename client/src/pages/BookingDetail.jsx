import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBookingById, deleteBooking } from '../api/bookings';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { analytics } from '../utils/analytics';

const SERVICE_LABELS = {
  oil_change:   'Oil Change',    brake_repair: 'Brake Repair',
  tire_rotation:'Tire Rotation', engine_check: 'Engine Check',
  transmission: 'Transmission',  battery:      'Battery',
  ac_repair:    'A/C Repair',   inspection:   'Full Inspection',
  other:        'Other',
};

const formatDate = (date) =>
  new Date(date).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const justCreated = location.state?.created;

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBookingById(id);
        setBooking(res.data);
        analytics.bookingViewed(id);
      } catch (err) {
        setError(err.message || 'Booking not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteBooking(id);
      analytics.bookingDeleted(id);
      navigate('/', { state: { deleted: true } });
    } catch (err) {
      setError(err.message || 'Failed to delete booking.');
      setShowDelete(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading booking details…" />;

  if (error) {
    return (
      <main className="page-wrapper" id="main-content">
        <div className="container page-content">
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Error:</strong> {error}
              <br />
              <Link to="/" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>← Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!booking) return null;

  return (
    <main className="page-wrapper" id="main-content">
      <div className="container page-content">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Dashboard</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <span aria-current="page">Booking #{booking._id?.slice(-6).toUpperCase()}</span>
        </nav>

        {justCreated && (
          <div className="alert alert-success" role="status" aria-live="polite">
            <span className="alert-icon">✅</span>
            <span>Booking created successfully!</span>
          </div>
        )}

        {/* Header */}
        <div className="page-header">
          <div className="page-header-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <StatusBadge status={booking.status} />
              <PriorityBadge priority={booking.priority} />
            </div>
            <h1 className="page-title">{booking.customerName}</h1>
            <p className="page-subtitle">
              {booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}
              {' · '}{SERVICE_LABELS[booking.serviceType] || booking.serviceType}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to={`/bookings/${id}/edit`} className="btn btn-secondary" aria-label="Edit this booking">
              ✏️ Edit
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => setShowDelete(true)}
              aria-label="Delete this booking"
            >
              🗑 Delete
            </button>
          </div>
        </div>

        {/* Detail Grid */}
        <div className="detail-grid">
          <div>
            {/* Customer Info */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="section-header">
                <h2 className="section-title">Customer Information</h2>
                <div className="section-divider" aria-hidden="true" />
              </div>
              <div className="detail-fields-grid">
                <div className="detail-field">
                  <span className="detail-field-label">Full Name</span>
                  <span className="detail-field-value">{booking.customerName}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Phone</span>
                  <a href={`tel:${booking.customerPhone}`} className="detail-field-value" style={{ color: 'var(--accent-light)' }}>
                    {booking.customerPhone}
                  </a>
                </div>
                {booking.customerEmail && (
                  <div className="detail-field">
                    <span className="detail-field-label">Email</span>
                    <a href={`mailto:${booking.customerEmail}`} className="detail-field-value" style={{ color: 'var(--accent-light)' }}>
                      {booking.customerEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="section-header">
                <h2 className="section-title">Vehicle Information</h2>
                <div className="section-divider" aria-hidden="true" />
              </div>
              <div className="detail-fields-grid">
                <div className="detail-field">
                  <span className="detail-field-label">Make</span>
                  <span className="detail-field-value">{booking.vehicleMake}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Model</span>
                  <span className="detail-field-value">{booking.vehicleModel}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Year</span>
                  <span className="detail-field-value">{booking.vehicleYear}</span>
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="card">
              <div className="section-header">
                <h2 className="section-title">Service Details</h2>
                <div className="section-divider" aria-hidden="true" />
              </div>
              <div className="detail-fields-grid">
                <div className="detail-field">
                  <span className="detail-field-label">Service Type</span>
                  <span className="detail-field-value">{SERVICE_LABELS[booking.serviceType] || booking.serviceType}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Assigned Mechanic</span>
                  <span className="detail-field-value">{booking.assignedMechanic}</span>
                </div>
                {booking.estimatedCost != null && (
                  <div className="detail-field">
                    <span className="detail-field-label">Estimated Cost</span>
                    <span className="detail-field-value booking-cost">
                      ₹{Number(booking.estimatedCost).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {booking.description && (
                  <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
                    <span className="detail-field-label">Notes</span>
                    <span className="detail-field-value" style={{ color: 'var(--color-300)', fontStyle: 'italic' }}>
                      {booking.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="card">
              <div className="section-header">
                <h2 className="section-title">Job Status</h2>
                <div className="section-divider" aria-hidden="true" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="detail-field">
                  <span className="detail-field-label">Status</span>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Priority</span>
                  <PriorityBadge priority={booking.priority} />
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Booking ID</span>
                  <code style={{ fontSize: 12, color: 'var(--color-400)', background: 'var(--color-800)', padding: '2px 6px', borderRadius: 4 }}>
                    #{booking._id?.slice(-8).toUpperCase()}
                  </code>
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Created</span>
                  <span className="detail-field-value text-sm">{formatDate(booking.createdAt)}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-field-label">Last Updated</span>
                  <span className="detail-field-value text-sm">{formatDate(booking.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Booking?"
        message={`This will permanently delete the booking for ${booking.customerName}. This action cannot be undone.`}
        confirmLabel="Delete Booking"
        cancelLabel="Keep It"
        isDangerous
        isLoading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </main>
  );
}
