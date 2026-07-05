import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, deleteBooking, getStats } from '../api/bookings';
import BookingCard from '../components/BookingCard';
import StatsCard from '../components/StatsCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import { analytics } from '../utils/analytics';

const DEFAULT_FILTERS = { status: 'all', serviceType: 'all', priority: 'all' };

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { search, ...filters };
      const res = await getBookings(params);
      setBookings(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getStats();
      setStats(res.data);
    } catch {
      // Stats failure is non-critical
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Debounced search + filter
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
      if (search) analytics.searchPerformed(search);
      if (Object.values(filters).some((v) => v !== 'all')) analytics.filterApplied(filters);
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchBookings, search, filters]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteBooking(deleteTarget._id);
      analytics.bookingDeleted(deleteTarget._id);
      setBookings((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      fetchStats();
    } catch (err) {
      setError(err.message || 'Failed to delete booking.');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <main className="page-wrapper" id="main-content">
      <div className="container page-content">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Manage all mechanic service bookings</p>
          </div>
          <Link to="/bookings/new" className="btn btn-primary btn-lg" aria-label="Create new booking">
            ＋ New Booking
          </Link>
        </div>

        {/* Stats */}
        {!statsLoading && stats && (
          <section aria-label="Booking statistics">
            <div className="stats-grid">
              <StatsCard icon="📋" value={stats.total}       label="Total Bookings"   color="var(--accent)" />
              <StatsCard icon="⏳" value={stats.pending}     label="Pending"          color="var(--status-pending)" />
              <StatsCard icon="🔧" value={stats.in_progress} label="In Progress"      color="var(--status-in_progress)" />
              <StatsCard icon="✅" value={stats.completed}   label="Completed"        color="var(--status-completed)" />
              <StatsCard icon="✗"  value={stats.cancelled}   label="Cancelled"        color="var(--color-400)" />
              <StatsCard icon="⚡" value={stats.highPriority}label="High Priority"    color="var(--priority-urgent)" />
            </div>
          </section>
        )}
        {statsLoading && (
          <div style={{ height: 100, display: 'flex', alignItems: 'center' }} aria-label="Loading statistics">
            <span className="spinner spinner-sm" aria-hidden="true" />
            <span className="text-muted" style={{ marginLeft: 12 }}>Loading stats…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Error:</strong> {error}
              <br />
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={fetchBookings}>
                🔄 Retry
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar" role="search" aria-label="Search and filter bookings">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar filters={filters} onChange={setFilters} />
          {(search || Object.values(filters).some((v) => v !== 'all')) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearch(''); setFilters(DEFAULT_FILTERS); }}
              aria-label="Clear all filters"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Booking Count */}
        {!loading && (
          <p className="text-muted text-sm mb-6" aria-live="polite">
            {bookings.length === 0
              ? 'No bookings found'
              : `Showing ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`}
          </p>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Loading bookings…" />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon="🔧"
            title="No bookings found"
            text={
              search || Object.values(filters).some((v) => v !== 'all')
                ? "Try adjusting your search or filters to find what you're looking for."
                : 'Get started by creating your first service booking.'
            }
            actionLabel={!search ? '+ Create First Booking' : undefined}
            actionTo="/bookings/new"
          />
        ) : (
          <section aria-label="Bookings list">
            <div className="booking-grid">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onDelete={(b) => setDeleteTarget(b)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Booking?"
        message={
          deleteTarget
            ? `This will permanently delete the booking for ${deleteTarget.customerName} (${deleteTarget.vehicleYear} ${deleteTarget.vehicleMake} ${deleteTarget.vehicleModel}). This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Booking"
        cancelLabel="Keep It"
        isDangerous
        isLoading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}
