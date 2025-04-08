import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ notifications }) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <div className="text-xl font-bold">
          <Link to="/">Recipe Sharing</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-orange-500">Homepage</Link>
          <Link to="/dashboard" className="hover:text-orange-500">Dashboard</Link>
          <Link to="/create" className="hover:text-orange-500">Create Recipe</Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="flex items-center space-x-1 hover:text-orange-500 focus:outline-none"
            >
              <span>Notifications</span>
              {notifications.length > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {notifications.length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Notifications</h3>
                  {notifications.length > 0 ? (
                    notifications.map((note) => (
                      <div key={note._id} className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <p>{note.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(note.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;