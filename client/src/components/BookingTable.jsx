import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import './BookingTable.css';

export default function BookingTable({ bookings, onDelete }) {
  if (bookings.length === 0) return null;

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" aria-label="Select all" /></th>
            <th>Name</th>
            <th>Date</th>
            <th>Job title</th>
            <th>Employment Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const dateStr = new Date(booking.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric'
            });
            const initials = booking.customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            return (
              <tr key={booking._id}>
                <td><input type="checkbox" aria-label={`Select ${booking.customerName}`} /></td>
                <td>
                  <div className="user-cell">
                    <div className="avatar">{initials}</div>
                    <div className="user-details">
                      <span className="user-name">{booking.customerName}</span>
                      <span className="user-email">{booking.customerEmail || booking.customerPhone}</span>
                    </div>
                  </div>
                </td>
                <td>{dateStr}</td>
                <td>{booking.serviceType || 'General Service'}</td>
                <td>
                  <StatusBadge status={booking.status} />
                </td>
                <td className="actions-cell">
                  <div className="dropdown">
                    <button className="btn btn-ghost btn-icon" aria-label="More options">
                      ⋮
                    </button>
                    <div className="dropdown-content">
                      <Link to={`/bookings/${booking._id}`} className="dropdown-item">View Details</Link>
                      <Link to={`/bookings/${booking._id}/edit`} className="dropdown-item">Edit</Link>
                      <button onClick={() => onDelete(booking._id)} className="dropdown-item text-danger">Delete</button>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
