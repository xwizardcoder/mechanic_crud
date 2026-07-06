import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getBookingById, updateBooking } from '../api/bookings';
import BookingForm from '../components/BookingForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { analytics } from '../utils/analytics';

export default function EditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBookingById(id);
        setBooking(res.data);
      } catch (err) {
        setError(err.message || 'Booking not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setServerErrors([]);
    try {
      const res = await updateBooking(id, data);
      analytics.bookingUpdated(res.data);
      navigate(`/bookings/${id}`, { state: { updated: true } });
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setServerErrors(err.errors);
      } else {
        setError(err.message || 'Failed to update booking. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading booking…" />;

  if (error && !booking) {
    return (
      <main className="page-wrapper" id="main-content">
        <div className="container page-content">
          <div className="alert alert-error" role="alert">
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

  return (
    <main className="page-wrapper" id="main-content">
      <div className="container page-content">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Dashboard</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <Link to={`/bookings/${id}`}>Booking #{id?.slice(-6).toUpperCase()}</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <span aria-current="page">Edit</span>
        </nav>

        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Edit Booking</h1>
            <p className="page-subtitle">
              Update details for {booking?.customerName}'s{' '}
              {booking?.vehicleYear} {booking?.vehicleMake} {booking?.vehicleModel}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        <div className="card">
          {booking && (
            <BookingForm
              initialData={{
                customerName:     booking.customerName || '',
                customerPhone:    booking.customerPhone || '',
                customerEmail:    booking.customerEmail || '',
                vehicleMake:      booking.vehicleMake || '',
                vehicleModel:     booking.vehicleModel || '',
                vehicleYear:      booking.vehicleYear || '',
                serviceType:      booking.serviceType || '',
                description:      booking.description || '',
                assignedMechanic: booking.assignedMechanic || '',
                status:           booking.status || 'pending',
                priority:         booking.priority || 'normal',
                estimatedCost:    booking.estimatedCost ?? '',
              }}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              submitLabel="Update Booking"
              serverErrors={serverErrors}
            />
          )}
        </div>
      </div>
    </main>
  );
}
