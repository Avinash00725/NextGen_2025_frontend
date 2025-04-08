import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Register attempt with:', formData);
      const res = await register(formData);
      console.log('Register response:', res.data);
      const token = res.data.token || res.data.accessToken;
      const userId = res.data.userId || res.data.id;
      if (!token) throw new Error('No token received from server');
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      toast.success('Registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Register error:', errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
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
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;