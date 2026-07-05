import { useState, useId } from 'react';
import { sanitizeObject } from '../utils/sanitize';

const MECHANICS = [
  'Rajesh Kumar', 'Priya Sharma', 'Mohammed Ali', 'Sunita Patel',
  'Arjun Singh', 'Kavita Reddy', 'Deepak Verma', 'Anita Nair',
];

const SERVICE_OPTIONS = [
  { value: '', label: '— Select Service Type —' },
  { value: 'oil_change',   label: 'Oil Change' },
  { value: 'brake_repair', label: 'Brake Repair' },
  { value: 'tire_rotation',label: 'Tire Rotation' },
  { value: 'engine_check', label: 'Engine Check' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'battery',      label: 'Battery' },
  { value: 'ac_repair',    label: 'A/C Repair' },
  { value: 'inspection',   label: 'Full Inspection' },
  { value: 'other',        label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed',   label: 'Completed' },
  { value: 'cancelled',   label: 'Cancelled' },
];

const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high',   label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const DEFAULT_FORM = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  serviceType: '',
  description: '',
  assignedMechanic: '',
  status: 'pending',
  priority: 'normal',
  estimatedCost: '',
};

const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function validate(data) {
  const errors = {};
  const year = Number(data.vehicleYear);
  const currentYear = new Date().getFullYear();

  if (!data.customerName.trim()) errors.customerName = 'Customer name is required';
  if (!data.customerPhone.trim()) errors.customerPhone = 'Phone number is required';
  else if (!PHONE_REGEX.test(data.customerPhone.trim())) errors.customerPhone = 'Enter a valid phone number';
  if (data.customerEmail.trim() && !EMAIL_REGEX.test(data.customerEmail.trim())) {
    errors.customerEmail = 'Enter a valid email address';
  }
  if (!data.vehicleMake.trim()) errors.vehicleMake = 'Vehicle make is required';
  if (!data.vehicleModel.trim()) errors.vehicleModel = 'Vehicle model is required';
  if (!data.vehicleYear) errors.vehicleYear = 'Vehicle year is required';
  else if (isNaN(year) || year < 1900 || year > currentYear + 1) {
    errors.vehicleYear = `Year must be between 1900 and ${currentYear + 1}`;
  }
  if (!data.serviceType) errors.serviceType = 'Please select a service type';
  if (!data.assignedMechanic.trim()) errors.assignedMechanic = 'Assigned mechanic is required';
  if (data.estimatedCost !== '' && (isNaN(Number(data.estimatedCost)) || Number(data.estimatedCost) < 0)) {
    errors.estimatedCost = 'Cost must be a positive number';
  }

  return errors;
}

export default function BookingForm({ initialData = {}, onSubmit, isLoading = false, submitLabel = 'Save Booking', serverErrors = [] }) {
  const formId = useId();
  const [data, setData] = useState({ ...DEFAULT_FORM, ...initialData });
  const [touched, setTouched] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  // Merge server errors into field-level errors
  const serverFieldErrors = {};
  serverErrors.forEach(({ field, message }) => {
    serverFieldErrors[field] = message;
  });
  const errors = { ...clientErrors, ...serverFieldErrors };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) setClientErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate({ ...data });
    setClientErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const showError = (field) => touched[field] && errors[field];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Touch all fields to show all errors
    const allTouched = Object.fromEntries(Object.keys(DEFAULT_FORM).map((k) => [k, true]));
    setTouched(allTouched);
    const allErrors = validate(data);
    setClientErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      // Focus first error field
      const firstErrorField = Object.keys(allErrors)[0];
      document.getElementById(`${formId}-${firstErrorField}`)?.focus();
      return;
    }
    // Sanitize before submitting
    const sanitized = sanitizeObject(data);
    onSubmit(sanitized);
  };

  const Field = ({ name, label, required, children }) => (
    <div className="form-group">
      <label htmlFor={`${formId}-${name}`} className="form-label">
        {label}{required && <span className="required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {showError(name) && (
        <span className="form-error" role="alert" id={`${formId}-${name}-error`}>
          ⚠ {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <form
      className="form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Booking form"
    >
      {/* ── Customer Information ── */}
      <div className="form-grid">
        <div className="form-section-title" role="heading" aria-level="3">Customer Information</div>

        <Field name="customerName" label="Customer Name" required>
          <input
            id={`${formId}-customerName`}
            type="text"
            className={`form-input${showError('customerName') ? ' error' : ''}`}
            value={data.customerName}
            onChange={handleChange('customerName')}
            onBlur={handleBlur('customerName')}
            placeholder="e.g. Ravi Sharma"
            aria-required="true"
            aria-invalid={!!showError('customerName')}
            aria-describedby={showError('customerName') ? `${formId}-customerName-error` : undefined}
            autoComplete="name"
          />
        </Field>

        <Field name="customerPhone" label="Phone Number" required>
          <input
            id={`${formId}-customerPhone`}
            type="tel"
            className={`form-input${showError('customerPhone') ? ' error' : ''}`}
            value={data.customerPhone}
            onChange={handleChange('customerPhone')}
            onBlur={handleBlur('customerPhone')}
            placeholder="e.g. 9876543210"
            aria-required="true"
            aria-invalid={!!showError('customerPhone')}
            aria-describedby={showError('customerPhone') ? `${formId}-customerPhone-error` : undefined}
            autoComplete="tel"
          />
        </Field>

        <Field name="customerEmail" label="Email Address">
          <input
            id={`${formId}-customerEmail`}
            type="email"
            className={`form-input${showError('customerEmail') ? ' error' : ''}`}
            value={data.customerEmail}
            onChange={handleChange('customerEmail')}
            onBlur={handleBlur('customerEmail')}
            placeholder="e.g. ravi@example.com"
            aria-invalid={!!showError('customerEmail')}
            aria-describedby={showError('customerEmail') ? `${formId}-customerEmail-error` : undefined}
            autoComplete="email"
          />
        </Field>

        {/* ── Vehicle Information ── */}
        <div className="form-section-title" role="heading" aria-level="3">Vehicle Information</div>

        <Field name="vehicleMake" label="Vehicle Make" required>
          <input
            id={`${formId}-vehicleMake`}
            type="text"
            className={`form-input${showError('vehicleMake') ? ' error' : ''}`}
            value={data.vehicleMake}
            onChange={handleChange('vehicleMake')}
            onBlur={handleBlur('vehicleMake')}
            placeholder="e.g. Toyota, Maruti, Honda"
            aria-required="true"
            aria-invalid={!!showError('vehicleMake')}
            aria-describedby={showError('vehicleMake') ? `${formId}-vehicleMake-error` : undefined}
          />
        </Field>

        <Field name="vehicleModel" label="Vehicle Model" required>
          <input
            id={`${formId}-vehicleModel`}
            type="text"
            className={`form-input${showError('vehicleModel') ? ' error' : ''}`}
            value={data.vehicleModel}
            onChange={handleChange('vehicleModel')}
            onBlur={handleBlur('vehicleModel')}
            placeholder="e.g. Camry, Swift, City"
            aria-required="true"
            aria-invalid={!!showError('vehicleModel')}
            aria-describedby={showError('vehicleModel') ? `${formId}-vehicleModel-error` : undefined}
          />
        </Field>

        <Field name="vehicleYear" label="Vehicle Year" required>
          <input
            id={`${formId}-vehicleYear`}
            type="number"
            className={`form-input${showError('vehicleYear') ? ' error' : ''}`}
            value={data.vehicleYear}
            onChange={handleChange('vehicleYear')}
            onBlur={handleBlur('vehicleYear')}
            placeholder={`e.g. ${new Date().getFullYear()}`}
            min="1900"
            max={new Date().getFullYear() + 1}
            aria-required="true"
            aria-invalid={!!showError('vehicleYear')}
            aria-describedby={showError('vehicleYear') ? `${formId}-vehicleYear-error` : undefined}
          />
        </Field>

        {/* ── Service Details ── */}
        <div className="form-section-title" role="heading" aria-level="3">Service Details</div>

        <Field name="serviceType" label="Service Type" required>
          <select
            id={`${formId}-serviceType`}
            className={`form-select${showError('serviceType') ? ' error' : ''}`}
            value={data.serviceType}
            onChange={handleChange('serviceType')}
            onBlur={handleBlur('serviceType')}
            aria-required="true"
            aria-invalid={!!showError('serviceType')}
            aria-describedby={showError('serviceType') ? `${formId}-serviceType-error` : undefined}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={!opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field name="assignedMechanic" label="Assigned Mechanic" required>
          <select
            id={`${formId}-assignedMechanic`}
            className={`form-select${showError('assignedMechanic') ? ' error' : ''}`}
            value={data.assignedMechanic}
            onChange={handleChange('assignedMechanic')}
            onBlur={handleBlur('assignedMechanic')}
            aria-required="true"
            aria-invalid={!!showError('assignedMechanic')}
            aria-describedby={showError('assignedMechanic') ? `${formId}-assignedMechanic-error` : undefined}
          >
            <option value="">— Select Mechanic —</option>
            {MECHANICS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </Field>

        <Field name="status" label="Status">
          <select
            id={`${formId}-status`}
            className="form-select"
            value={data.status}
            onChange={handleChange('status')}
            aria-label="Job status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Field>

        <Field name="priority" label="Priority">
          <select
            id={`${formId}-priority`}
            className="form-select"
            value={data.priority}
            onChange={handleChange('priority')}
            aria-label="Job priority"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Field>

        <Field name="estimatedCost" label="Estimated Cost (₹)">
          <input
            id={`${formId}-estimatedCost`}
            type="number"
            className={`form-input${showError('estimatedCost') ? ' error' : ''}`}
            value={data.estimatedCost}
            onChange={handleChange('estimatedCost')}
            onBlur={handleBlur('estimatedCost')}
            placeholder="e.g. 1500"
            min="0"
            step="50"
            aria-invalid={!!showError('estimatedCost')}
            aria-describedby={showError('estimatedCost') ? `${formId}-estimatedCost-error` : undefined}
          />
        </Field>

        <div className="form-group full-width">
          <label htmlFor={`${formId}-description`} className="form-label">Description / Notes</label>
          <textarea
            id={`${formId}-description`}
            className="form-textarea"
            value={data.description}
            onChange={handleChange('description')}
            onBlur={handleBlur('description')}
            placeholder="Any additional notes about the job, customer complaints, or special instructions…"
            maxLength={500}
            aria-describedby={`${formId}-description-hint`}
          />
          <span className="form-hint" id={`${formId}-description-hint`}>
            {data.description.length}/500 characters
          </span>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label={isLoading ? 'Saving booking…' : submitLabel}
          >
            {isLoading ? (
              <>
                <span className="spinner spinner-sm" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>💾 {submitLabel}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
