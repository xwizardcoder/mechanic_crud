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

// ─── Field wrapper — defined OUTSIDE BookingForm to prevent remount on each keystroke ───
function Field({ name, label, required, formId, errors, touched, children }) {
  const hasError = touched[name] && errors[name];
  return (
    <div className="form-group">
      <label htmlFor={`${formId}-${name}`} className="form-label">
        {label}{required && <span className="required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hasError && (
        <span className="form-error" role="alert" id={`${formId}-${name}-error`}>
          ⚠ {errors[name]}
        </span>
      )}
    </div>
  );
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

  // Shared props passed to every <Field> so it stays stable across renders
  const fieldProps = { formId, errors, touched };

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

        <Field name="customerName" label="Customer Name" required {...fieldProps}>
          <input
            id={`${formId}-customerName`}
            type="text"
            className={`form-input${touched.customerName && errors.customerName ? ' error' : ''}`}
            value={data.customerName}
            onChange={handleChange('customerName')}
            onBlur={handleBlur('customerName')}
            placeholder="e.g. Ravi Sharma"
            aria-required="true"
            aria-invalid={!!(touched.customerName && errors.customerName)}
            aria-describedby={touched.customerName && errors.customerName ? `${formId}-customerName-error` : undefined}
            autoComplete="name"
          />
        </Field>

        <Field name="customerPhone" label="Phone Number" required {...fieldProps}>
          <input
            id={`${formId}-customerPhone`}
            type="tel"
            className={`form-input${touched.customerPhone && errors.customerPhone ? ' error' : ''}`}
            value={data.customerPhone}
            onChange={handleChange('customerPhone')}
            onBlur={handleBlur('customerPhone')}
            placeholder="e.g. 9876543210"
            aria-required="true"
            aria-invalid={!!(touched.customerPhone && errors.customerPhone)}
            aria-describedby={touched.customerPhone && errors.customerPhone ? `${formId}-customerPhone-error` : undefined}
            autoComplete="tel"
          />
        </Field>

        <Field name="customerEmail" label="Email Address" {...fieldProps}>
          <input
            id={`${formId}-customerEmail`}
            type="email"
            className={`form-input${touched.customerEmail && errors.customerEmail ? ' error' : ''}`}
            value={data.customerEmail}
            onChange={handleChange('customerEmail')}
            onBlur={handleBlur('customerEmail')}
            placeholder="e.g. ravi@example.com"
            aria-invalid={!!(touched.customerEmail && errors.customerEmail)}
            aria-describedby={touched.customerEmail && errors.customerEmail ? `${formId}-customerEmail-error` : undefined}
            autoComplete="email"
          />
        </Field>

        {/* ── Vehicle Information ── */}
        <div className="form-section-title" role="heading" aria-level="3">Vehicle Information</div>

        <Field name="vehicleMake" label="Vehicle Make" required {...fieldProps}>
          <input
            id={`${formId}-vehicleMake`}
            type="text"
            className={`form-input${touched.vehicleMake && errors.vehicleMake ? ' error' : ''}`}
            value={data.vehicleMake}
            onChange={handleChange('vehicleMake')}
            onBlur={handleBlur('vehicleMake')}
            placeholder="e.g. Toyota, Maruti, Honda"
            aria-required="true"
            aria-invalid={!!(touched.vehicleMake && errors.vehicleMake)}
            aria-describedby={touched.vehicleMake && errors.vehicleMake ? `${formId}-vehicleMake-error` : undefined}
          />
        </Field>

        <Field name="vehicleModel" label="Vehicle Model" required {...fieldProps}>
          <input
            id={`${formId}-vehicleModel`}
            type="text"
            className={`form-input${touched.vehicleModel && errors.vehicleModel ? ' error' : ''}`}
            value={data.vehicleModel}
            onChange={handleChange('vehicleModel')}
            onBlur={handleBlur('vehicleModel')}
            placeholder="e.g. Camry, Swift, City"
            aria-required="true"
            aria-invalid={!!(touched.vehicleModel && errors.vehicleModel)}
            aria-describedby={touched.vehicleModel && errors.vehicleModel ? `${formId}-vehicleModel-error` : undefined}
          />
        </Field>

        <Field name="vehicleYear" label="Vehicle Year" required {...fieldProps}>
          <input
            id={`${formId}-vehicleYear`}
            type="number"
            className={`form-input${touched.vehicleYear && errors.vehicleYear ? ' error' : ''}`}
            value={data.vehicleYear}
            onChange={handleChange('vehicleYear')}
            onBlur={handleBlur('vehicleYear')}
            placeholder={`e.g. ${new Date().getFullYear()}`}
            min="1900"
            max={new Date().getFullYear() + 1}
            aria-required="true"
            aria-invalid={!!(touched.vehicleYear && errors.vehicleYear)}
            aria-describedby={touched.vehicleYear && errors.vehicleYear ? `${formId}-vehicleYear-error` : undefined}
          />
        </Field>

        {/* ── Service Details ── */}
        <div className="form-section-title" role="heading" aria-level="3">Service Details</div>

        <Field name="serviceType" label="Service Type" required {...fieldProps}>
          <select
            id={`${formId}-serviceType`}
            className={`form-select${touched.serviceType && errors.serviceType ? ' error' : ''}`}
            value={data.serviceType}
            onChange={handleChange('serviceType')}
            onBlur={handleBlur('serviceType')}
            aria-required="true"
            aria-invalid={!!(touched.serviceType && errors.serviceType)}
            aria-describedby={touched.serviceType && errors.serviceType ? `${formId}-serviceType-error` : undefined}
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={!opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <Field name="assignedMechanic" label="Assigned Mechanic" required {...fieldProps}>
          <select
            id={`${formId}-assignedMechanic`}
            className={`form-select${touched.assignedMechanic && errors.assignedMechanic ? ' error' : ''}`}
            value={data.assignedMechanic}
            onChange={handleChange('assignedMechanic')}
            onBlur={handleBlur('assignedMechanic')}
            aria-required="true"
            aria-invalid={!!(touched.assignedMechanic && errors.assignedMechanic)}
            aria-describedby={touched.assignedMechanic && errors.assignedMechanic ? `${formId}-assignedMechanic-error` : undefined}
          >
            <option value="">— Select Mechanic —</option>
            {MECHANICS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </Field>

        <Field name="status" label="Status" {...fieldProps}>
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

        <Field name="priority" label="Priority" {...fieldProps}>
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

        <Field name="estimatedCost" label="Estimated Cost (₹)" {...fieldProps}>
          <input
            id={`${formId}-estimatedCost`}
            type="number"
            className={`form-input${touched.estimatedCost && errors.estimatedCost ? ' error' : ''}`}
            value={data.estimatedCost}
            onChange={handleChange('estimatedCost')}
            onBlur={handleBlur('estimatedCost')}
            placeholder="e.g. 1500"
            min="0"
            step="50"
            aria-invalid={!!(touched.estimatedCost && errors.estimatedCost)}
            aria-describedby={touched.estimatedCost && errors.estimatedCost ? `${formId}-estimatedCost-error` : undefined}
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
