/**
 * Simulated Analytics / Telemetry
 * Logs structured events to the console with an [Analytics] prefix.
 * In a production app, this would POST to an analytics endpoint.
 */

const log = (event, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[Analytics] ${event}`, { timestamp, ...data });
};

export const analytics = {
  bookingCreated: (booking) =>
    log('User interacted with Feature Complete CRUD — booking created', {
      bookingId: booking._id,
      customer: booking.customerName,
      service: booking.serviceType,
    }),

  bookingUpdated: (booking) =>
    log('User interacted with Feature Complete CRUD — booking updated', {
      bookingId: booking._id,
      status: booking.status,
    }),

  bookingDeleted: (id) =>
    log('User interacted with Feature Complete CRUD — booking deleted', { bookingId: id }),

  bookingViewed: (id) =>
    log('User interacted with Feature Complete CRUD — booking viewed', { bookingId: id }),

  searchPerformed: (query) =>
    log('User interacted with Feature Complete CRUD — search performed', { query }),

  filterApplied: (filters) =>
    log('User interacted with Feature Complete CRUD — filter applied', filters),
};
