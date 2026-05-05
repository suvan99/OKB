import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FormInput, Button, Alert, LoadingSpinner } from './common';
import { validators, createValidator } from '../utils/validation';
import useFormValidation from '../hooks/useFormValidation';

export default function SignupForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const { values, errors, handleChange, handleBlur, validateForm } = useFormValidation(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    {
      firstName: validators.required('First name is required'),
      lastName: validators.required('Last name is required'),
      email: createValidator(
        validators.required('Email is required'),
        validators.email()
      ),
      password: createValidator(
        validators.required('Password is required'),
        validators.minLength(6, 'Password must be at least 6 characters')
      ),
      confirmPassword: validators.custom(
        (value) => value === values.password,
        'Passwords do not match'
      ),
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = values;
      const response = await authAPI.register(dataToSend);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {generalError && (
          <Alert type="error" message={generalError} onClose={() => setGeneralError('')} />
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.firstName}
            required
          />

          <FormInput
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastName}
            required
          />

          <FormInput
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
          />

          <FormInput
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            required
          />

          <FormInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" disabled={loading} variant="success" className="w-full">
            {loading ? <LoadingSpinner size="sm" className="inline-block mr-2" /> : null}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
