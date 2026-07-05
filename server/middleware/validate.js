const VALID_SERVICE_TYPES = [
  'oil_change', 'brake_repair', 'tire_rotation', 'engine_check',
  'transmission', 'battery', 'ac_repair', 'inspection', 'other',
];

const VALID_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'];
const VALID_PRIORITIES = ['low', 'normal', 'high', 'urgent'];

const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validateBooking = (req, res, next) => {
  const errors = [];
  const {
    customerName, customerPhone, customerEmail,
    vehicleMake, vehicleModel, vehicleYear,
    serviceType, assignedMechanic, status, priority, estimatedCost,
  } = req.body;

  if (!customerName || customerName.trim().length === 0) {
    errors.push({ field: 'customerName', message: 'Customer name is required' });
  } else if (customerName.trim().length > 100) {
    errors.push({ field: 'customerName', message: 'Customer name cannot exceed 100 characters' });
  }

  if (!customerPhone || customerPhone.trim().length === 0) {
    errors.push({ field: 'customerPhone', message: 'Customer phone is required' });
  } else if (!PHONE_REGEX.test(customerPhone.trim())) {
    errors.push({ field: 'customerPhone', message: 'Please enter a valid phone number' });
  }

  if (customerEmail && customerEmail.trim().length > 0) {
    if (!EMAIL_REGEX.test(customerEmail.trim())) {
      errors.push({ field: 'customerEmail', message: 'Please enter a valid email address' });
    }
  }

  if (!vehicleMake || vehicleMake.trim().length === 0) {
    errors.push({ field: 'vehicleMake', message: 'Vehicle make is required' });
  }

  if (!vehicleModel || vehicleModel.trim().length === 0) {
    errors.push({ field: 'vehicleModel', message: 'Vehicle model is required' });
  }

  const yearNum = Number(vehicleYear);
  const currentYear = new Date().getFullYear();
  if (!vehicleYear && vehicleYear !== 0) {
    errors.push({ field: 'vehicleYear', message: 'Vehicle year is required' });
  } else if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
    errors.push({ field: 'vehicleYear', message: `Vehicle year must be between 1900 and ${currentYear + 1}` });
  }

  if (!serviceType || !VALID_SERVICE_TYPES.includes(serviceType)) {
    errors.push({ field: 'serviceType', message: 'Please select a valid service type' });
  }

  if (!assignedMechanic || assignedMechanic.trim().length === 0) {
    errors.push({ field: 'assignedMechanic', message: 'Assigned mechanic is required' });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority value' });
  }

  if (estimatedCost !== undefined && estimatedCost !== null && estimatedCost !== '') {
    const costNum = Number(estimatedCost);
    if (isNaN(costNum) || costNum < 0) {
      errors.push({ field: 'estimatedCost', message: 'Estimated cost must be a positive number' });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = { validateBooking };
