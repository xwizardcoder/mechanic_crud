// ─── Bookings Local API (localStorage Backend) ────────────────
// Implements client-side query filters, sorting, creation, and updates
// for pure offline operations without a server backend.

const SEED_BOOKINGS = [
  {
    _id: '60c72b2f9b1d8b2c8c8b4567',
    customerName: 'Rajesh Kumar',
    customerPhone: '9876543210',
    customerEmail: 'rajesh@example.com',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: 2021,
    serviceType: 'brake_repair',
    description: 'Brakes squeaking on high speed stops.',
    assignedMechanic: 'Sunita Patel',
    status: 'pending',
    priority: 'high',
    estimatedCost: 2500,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '60c72b2f9b1d8b2c8c8b4568',
    customerName: 'Priya Sharma',
    customerPhone: '9123456789',
    customerEmail: 'priya@example.com',
    vehicleMake: 'Maruti',
    vehicleModel: 'Swift',
    vehicleYear: 2018,
    serviceType: 'oil_change',
    description: 'Standard engine oil and oil filter replacement.',
    assignedMechanic: 'Priya Sharma',
    status: 'completed',
    priority: 'low',
    estimatedCost: 1500,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  }
];

const getStoredBookings = () => {
  const data = localStorage.getItem('mechpro_bookings');
  if (!data) {
    localStorage.setItem('mechpro_bookings', JSON.stringify(SEED_BOOKINGS));
    return SEED_BOOKINGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SEED_BOOKINGS;
  }
};

const saveStoredBookings = (bookings) => {
  localStorage.setItem('mechpro_bookings', JSON.stringify(bookings));
};

const generateId = () => {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

// ─── Exported API Functions ───────────────────────────────────

export const getBookings = async (params = {}) => {
  const {
    search = '',
    status,
    serviceType,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 20,
  } = params;

  // Small timeout to simulate network speed and keep loading skeletons visible
  await new Promise((resolve) => setTimeout(resolve, 300));

  let bookings = getStoredBookings();

  // Search filter
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    bookings = bookings.filter(
      (b) =>
        (b.customerName || '').toLowerCase().includes(q) ||
        (b.vehicleMake || '').toLowerCase().includes(q) ||
        (b.vehicleModel || '').toLowerCase().includes(q) ||
        (b.assignedMechanic || '').toLowerCase().includes(q)
    );
  }

  // Dropdown filters
  if (status && status !== 'all') {
    bookings = bookings.filter((b) => b.status === status);
  }
  if (serviceType && serviceType !== 'all') {
    bookings = bookings.filter((b) => b.serviceType === serviceType);
  }
  if (priority && priority !== 'all') {
    bookings = bookings.filter((b) => b.priority === priority);
  }

  // Sort logic
  bookings.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'priority') {
      const weights = { low: 1, normal: 2, high: 3, urgent: 4 };
      valA = weights[valA] || 0;
      valB = weights[valB] || 0;
    } else if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    } else if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginated selection
  const total = bookings.length;
  const startIndex = (page - 1) * limit;
  const paginated = bookings.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getBookingById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const bookings = getStoredBookings();
  const found = bookings.find((b) => b._id === id);
  if (!found) {
    throw { message: 'Booking not found' };
  }
  return { success: true, data: found };
};

export const createBooking = async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const bookings = getStoredBookings();
  const newBooking = {
    ...data,
    _id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  saveStoredBookings(bookings);
  return { success: true, data: newBooking, message: 'Booking created successfully' };
};

export const updateBooking = async (id, data) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const bookings = getStoredBookings();
  const idx = bookings.findIndex((b) => b._id === id);
  if (idx === -1) {
    throw { message: 'Booking not found' };
  }
  const updated = {
    ...bookings[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  bookings[idx] = updated;
  saveStoredBookings(bookings);
  return { success: true, data: updated, message: 'Booking updated successfully' };
};

export const deleteBooking = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  let bookings = getStoredBookings();
  const idx = bookings.findIndex((b) => b._id === id);
  if (idx === -1) {
    throw { message: 'Booking not found' };
  }
  bookings.splice(idx, 1);
  saveStoredBookings(bookings);
  return { success: true, message: 'Booking deleted successfully' };
};

export const getStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const bookings = getStoredBookings();
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const in_progress = bookings.filter((b) => b.status === 'in_progress').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;
  const highPriority = bookings.filter((b) => b.priority === 'high' || b.priority === 'urgent').length;

  return {
    success: true,
    data: { total, pending, in_progress, completed, cancelled, highPriority },
  };
};
