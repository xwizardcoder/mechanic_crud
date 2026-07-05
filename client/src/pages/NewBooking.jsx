import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/bookings';
import BookingForm from '../components/BookingForm';
import { analytics } from '../utils/analytics';

export default function NewBooking() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setServerErrors([]);
    try {
      const res = await createBooking(data);
      analytics.bookingCreated(res.data);
      navigate(`/bookings/${res.data._id}`, { state: { created: true } });
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setServerErrors(err.errors);
      } else {
        setError(err.message || 'Failed to create booking. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-wrapper" id="main-content">
      <div className="container page-content">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Dashboard</Link>
          <span className="breadcrumb-sep" aria-hidden="true">›</span>
          <span aria-current="page">New Booking</span>
        </nav>

        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">New Booking</h1>
            <p className="page-subtitle">Fill in the details to create a new service booking</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="card">
          <BookingForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Create Booking"
            serverErrors={serverErrors}
          />
        </div>
      </div>
    </main>
  );
}
