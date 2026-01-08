export type ValidationResult = string | null;

export const validators = {
  /**
   * Check if value is not empty
   */
  required: (value: string, fieldName = "This field"): ValidationResult => {
    return value.trim() ? null : `${fieldName} is required`;
  },

  /**
   * Validate Indian phone number (10 digits)
   */
  phone: (value: string): ValidationResult => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "Phone number is required";
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      return "Please enter a valid 10-digit mobile number";
    }
    return null;
  },

  /**
   * Validate Indian pincode (6 digits)
   */
  pincode: (value: string): ValidationResult => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "Pincode is required";
    if (!/^[1-9][0-9]{5}$/.test(cleaned)) {
      return "Please enter a valid 6-digit pincode";
    }
    return null;
  },

  /**
   * Validate email address (optional field)
   */
  email: (value: string): ValidationResult => {
    if (!value) return null; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },

  /**
   * Validate minimum length
   */
  minLength: (
    value: string,
    min: number,
    fieldName = "This field"
  ): ValidationResult => {
    if (value.trim().length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  /**
   * Validate maximum length
   */
  maxLength: (
    value: string,
    max: number,
    fieldName = "This field"
  ): ValidationResult => {
    if (value.trim().length > max) {
      return `${fieldName} must be less than ${max} characters`;
    }
    return null;
  },

  /**
   * Validate name (letters and spaces only)
   */
  name: (value: string): ValidationResult => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s.]+$/.test(value)) {
      return "Name can only contain letters and spaces";
    }
    return null;
  },

  /**
   * Validate address
   */
  address: (value: string): ValidationResult => {
    if (!value.trim()) return "Address is required";
    if (value.trim().length < 10) {
      return "Please enter a complete address";
    }
    return null;
  },

  /**
   * Validate city name
   */
  city: (value: string): ValidationResult => {
    if (!value.trim()) return "City is required";
    if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
      return "City name can only contain letters";
    }
    return null;
  },

  /**
   * Validate state name
   */
  state: (value: string): ValidationResult => {
    if (!value.trim()) return "State is required";
    return null;
  },

  /**
   * Validate positive number
   */
  positiveNumber: (
    value: number,
    fieldName = "This field"
  ): ValidationResult => {
    if (isNaN(value) || value <= 0) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  },

  /**
   * Validate URL
   */
  url: (value: string): ValidationResult => {
    if (!value) return null; // URL might be optional
    try {
      new URL(value);
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  },
};

/**
 * Validate multiple fields and return all errors
 */
export function validateForm<T extends Record<string, string>>(
  data: T,
  rules: Partial<Record<keyof T, (value: string) => ValidationResult>>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const [field, validator] of Object.entries(rules)) {
    if (validator) {
      const error = validator(data[field as keyof T] || "");
      if (error) {
        errors[field as keyof T] = error;
      }
    }
  }

  return errors;
}

/**
 * Check if form is valid (no errors)
 */
export function isFormValid<T>(errors: Partial<Record<keyof T, string>>): boolean {
  return Object.keys(errors).length === 0;
}

/**
 * Clean phone number to digits only
 */
export function cleanPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  // Remove country code if present
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Clean pincode to digits only
 */
export function cleanPincode(pincode: string): string {
  return pincode.replace(/\D/g, "").slice(0, 6);
}

// Individual validator functions for direct imports
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validatePhone(value: string): boolean {
  const cleaned = value.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(cleaned);
}

export function validatePincode(value: string): boolean {
  const cleaned = value.replace(/\D/g, "");
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

export function validateEmail(value: string): boolean {
  if (!value) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}
