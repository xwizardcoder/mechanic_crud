const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
      match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please enter a valid phone number'],
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
      default: null,
    },
    vehicleMake: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
      maxlength: [50, 'Vehicle make cannot exceed 50 characters'],
    },
    vehicleModel: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
      maxlength: [50, 'Vehicle model cannot exceed 50 characters'],
    },
    vehicleYear: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [1900, 'Vehicle year must be 1900 or later'],
      max: [new Date().getFullYear() + 1, 'Vehicle year cannot be in the future'],
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: {
        values: [
          'oil_change',
          'brake_repair',
          'tire_rotation',
          'engine_check',
          'transmission',
          'battery',
          'ac_repair',
          'inspection',
          'other',
        ],
        message: '{VALUE} is not a valid service type',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    assignedMechanic: {
      type: String,
      required: [true, 'Assigned mechanic is required'],
      trim: true,
      maxlength: [100, 'Mechanic name cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'normal', 'high', 'urgent'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'normal',
    },
    estimatedCost: {
      type: Number,
      min: [0, 'Estimated cost cannot be negative'],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Full vehicle info
BookingSchema.virtual('vehicleInfo').get(function () {
  return `${this.vehicleYear} ${this.vehicleMake} ${this.vehicleModel}`;
});

// Index for search performance
BookingSchema.index({ customerName: 'text', vehicleMake: 'text', vehicleModel: 'text' });
BookingSchema.index({ status: 1, priority: 1, createdAt: -1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

module.exports = Booking;
