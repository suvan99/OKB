import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FormInput, Button, Alert, LoadingSpinner } from './common';
import { validators, createValidator } from '../utils/validation';
import useFormValidation from '../hooks/useFormValidation';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const { values, errors, handleChange, handleBlur, validateForm } = useFormValidation(
    { email: '', password: '' },
    {
      email: createValidator(
        validators.required('Email is required'),
        validators.email()
      ),
      password: createValidator(
        validators.required('Password is required'),
        validators.minLength(6)
      ),
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.login(values);
      login(response.data.user, response.data.token);

      // Redirect based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {generalError && (
          <Alert type="error" message={generalError} onClose={() => setGeneralError('')} />
        )}

        <form onSubmit={handleSubmit}>
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <LoadingSpinner size="sm" className="inline-block mr-2" /> : null}
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
