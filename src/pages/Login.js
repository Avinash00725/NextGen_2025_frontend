import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setIsSubmitting(false);
      toast.error('Please enter both email and password');
      return;
    }

    try {
      console.log('Login attempt with:', formData);
      const res = await login(formData);
      console.log('Login response (full):', JSON.stringify(res.data, null, 2)); // Pretty print response

      // Extract token and userId with flexible checks
      const token = res.data.token || res.data.accessToken || res.data.authToken;
      const userId = res.data.userId || res.data.id || res.data._id || res.data.user?._id;
      if (!token || !userId) {
        throw new Error('Missing token or user ID in server response. Response:', JSON.stringify(res.data));
      }

      // Store credentials in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      console.log('Stored token:', token, 'Stored userId:', userId);

      toast.success('Logged in successfully!');
      navigate('/dashboard'); // Redirect after success
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Login error:', errorMessage, 'Response data:', err.response?.data, 'Status:', err.response?.status);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;