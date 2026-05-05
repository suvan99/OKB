export const validators = {
  required: (message = 'This field is required') => (value) => {
    return !value || !value.toString().trim() ? message : '';
  },

  email: (message = 'Invalid email format') => (value) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? message : '';
  },

  minLength: (min, message = `Minimum ${min} characters required`) => (value) => {
    return value && value.length < min ? message : '';
  },

  maxLength: (max, message = `Maximum ${max} characters allowed`) => (value) => {
    return value && value.length > max ? message : '';
  },

  passwordMatch: (getPassword, message = 'Passwords do not match') => (value) => {
    return value !== getPassword() ? message : '';
  },

  minValue: (min, message = `Minimum value is ${min}`) => (value) => {
    return value && Number(value) < min ? message : '';
  },

  maxValue: (max, message = `Maximum value is ${max}`) => (value) => {
    return value && Number(value) > max ? message : '';
  },

  phoneNumber: (message = 'Invalid phone number') => (value) => {
    if (!value) return '';
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return !phoneRegex.test(value) ? message : '';
  },

  url: (message = 'Invalid URL') => (value) => {
    if (!value) return '';
    try {
      new URL(value);
      return '';
    } catch {
      return message;
    }
  },

  custom: (validator, message = 'Invalid value') => (value) => {
    return !validator(value) ? message : '';
  },
};

export const createValidator = (...validatorFuncs) => (value) => {
  for (const validator of validatorFuncs) {
    const error = validator(value);
    if (error) return error;
  }
  return '';
};

export default validators;
