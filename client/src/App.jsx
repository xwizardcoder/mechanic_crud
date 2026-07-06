import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewBooking from './pages/NewBooking';
import BookingDetail from './pages/BookingDetail';
import EditBooking from './pages/EditBooking';
import ErrorBoundary from './components/ErrorBoundary';


function NotFound() {
  return (
    <main className="page-wrapper" id="main-content">
      <div className="container page-content flex-center" style={{ flexDirection: 'column', gap: 16, paddingTop: 80 }}>
        <h1 style={{ fontSize: 48, letterSpacing: '-0.04em' }}>404</h1>
        <p className="text-muted">This page doesn't exist. Looks like a loose bolt!</p>
        <a href="/" className="btn btn-primary">← Back to Dashboard</a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>

      <a
        href="#main-content"
        className="btn btn-primary"
        style={{
          position: 'absolute', top: -9999, left: -9999,
          zIndex: 9999,
        }}
        onFocus={(e) => {
          e.target.style.top = '8px';
          e.target.style.left = '8px';
        }}
        onBlur={(e) => {
          e.target.style.top = '-9999px';
          e.target.style.left = '-9999px';
        }}
      >
        Skip to main content
      </a>

      <Sidebar />

      <Routes>
        <Route path="/"                      element={<Dashboard />} />
        <Route path="/bookings"              element={<Navigate to="/" replace />} />
        <Route path="/bookings/new"          element={<NewBooking />} />
        <Route path="/bookings/:id"          element={<BookingDetail />} />
        <Route path="/bookings/:id/edit"     element={<EditBooking />} />
        <Route path="*"                      element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
