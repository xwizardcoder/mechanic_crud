import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBookings, deleteBooking, getStats } from '../api/bookings';
import BookingTable from '../components/BookingTable';
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
        <div className="page-header" style={{ marginBottom: 32, alignItems: 'center' }}>
          <div className="page-header-left">
            <h1 className="page-title" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-100)' }}>Bookings</h1>
            <p className="page-subtitle" style={{ color: 'var(--color-400)', marginTop: 4 }}>Manage and collaborate on all service bookings</p>
          </div>
          <Link to="/bookings/new" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-dark)', borderRadius: 'var(--radius-sm)' }} aria-label="Add new booking">
            Add booking
          </Link>
        </div>

        {/* Stats */}
        {!statsLoading && stats && (
          <section aria-label="Booking statistics">
            <div className="stats-grid">
              <StatsCard value={stats.total}       label="Total Bookings"   color="var(--accent)" />
              <StatsCard value={stats.pending}     label="Pending"          color="var(--status-pending)" />
              <StatsCard value={stats.in_progress} label="In Progress"      color="var(--status-in_progress)" />
              <StatsCard value={stats.completed}   label="Completed"        color="var(--status-completed)" />
              <StatsCard value={stats.cancelled}   label="Cancelled"        color="var(--color-400)" />
              <StatsCard value={stats.highPriority}label="High Priority"    color="var(--priority-urgent)" />
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
            <div>
              <strong>Error:</strong> {error}
              <br />
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={fetchBookings}>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar" role="search" aria-label="Search and filter bookings" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          {/* Status Tabs */}
          <div className="tabs" style={{ display: 'flex', gap: 4, background: 'var(--color-900)', padding: 4, borderRadius: 'var(--radius-lg)' }}>
            {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                className={`tab-btn ${filters.status === status ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, status })}
                style={{
                  padding: '6px 16px',
                  border: 'none',
                  background: filters.status === status ? 'var(--color-950)' : 'transparent',
                  color: filters.status === status ? 'var(--color-100)' : 'var(--color-400)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: filters.status === status ? 600 : 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  boxShadow: filters.status === status ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <SearchBar value={search} onChange={setSearch} />
            <FilterBar filters={filters} onChange={setFilters} hideStatus />
            {(search || Object.values(filters).some((v) => v !== 'all')) && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSearch(''); setFilters(DEFAULT_FILTERS); }}
                aria-label="Clear all filters"
              >
                Clear
              </button>
            )}
          </div>
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
            title="No bookings found"
            text={
              search || Object.values(filters).some((v) => v !== 'all')
                ? "Try adjusting your search or filters to find what you're looking for."
                : 'Get started by creating your first service booking.'
            }
            actionLabel={!search ? 'Create First Booking' : undefined}
            actionTo="/bookings/new"
          />
        ) : (
          <section aria-label="Bookings list">
            <BookingTable bookings={bookings} onDelete={(bId) => {
              const b = bookings.find(x => x._id === bId);
              setDeleteTarget(b);
            }} />
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
