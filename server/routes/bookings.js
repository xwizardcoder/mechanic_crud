const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const { validateBooking } = require('../middleware/validate');
const { sanitizeMiddleware } = require('../middleware/sanitize');
const { authorize } = require('../middleware/authorize');

// GET /api/bookings/stats — Dashboard statistics
router.get('/stats', authorize('stats'), async (req, res) => {
  try {
    const [total, pending, in_progress, completed, cancelled, highPriority] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'in_progress' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.countDocuments({ priority: { $in: ['high', 'urgent'] } }),
    ]);

    res.json({
      success: true,
      data: { total, pending, in_progress, completed, cancelled, highPriority },
    });
  } catch (error) {
    console.error('[API] Stats error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// GET /api/bookings — List all bookings with search, filter, sort
router.get('/', authorize('read'), async (req, res) => {
  try {
    const {
      search = '',
      status,
      serviceType,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    const query = {};

    if (search.trim()) {
      query.$or = [
        { customerName: { $regex: search.trim(), $options: 'i' } },
        { vehicleMake: { $regex: search.trim(), $options: 'i' } },
        { vehicleModel: { $regex: search.trim(), $options: 'i' } },
        { assignedMechanic: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (status && status !== 'all') query.status = status;
    if (serviceType && serviceType !== 'all') query.serviceType = serviceType;
    if (priority && priority !== 'all') query.priority = priority;

    const sortOptions = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'customerName', 'vehicleYear', 'estimatedCost', 'priority'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[safeSortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, totalCount] = await Promise.all([
      Booking.find(query).sort(sortOptions).skip(skip).limit(Number(limit)).lean(),
      Booking.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error) {
    console.error('[API] List bookings error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id — Single booking
router.get('/:id', authorize('read'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('[API] Get booking error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
});

// POST /api/bookings — Create booking
router.post('/', authorize('create'), sanitizeMiddleware, validateBooking, async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();

    console.log(`[Analytics] Booking created: ${saved._id} for ${saved.customerName}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: saved,
    });
  } catch (error) {
    console.error('[API] Create booking error:', error.message);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(422).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
});

// PUT /api/bookings/:id — Update booking
router.put('/:id', authorize('update'), sanitizeMiddleware, validateBooking, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    console.log(`[Analytics] Booking updated: ${booking._id} — status: ${booking.status}`);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('[API] Update booking error:', error.message);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(422).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
});

// DELETE /api/bookings/:id — Delete booking
router.delete('/:id', authorize('delete'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    console.log(`[Analytics] Booking deleted: ${req.params.id}`);

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('[API] Delete booking error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete booking' });
  }
});

module.exports = router;
