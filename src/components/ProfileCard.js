import React, { useState } from 'react';

// Import local avatar images
import Avatar1 from '../assets/avatars/avatar1.png';
import Avatar2 from '../assets/avatars/avatar2.jpg';
import Avatar3 from '../assets/avatars/avatar3.jpg';
import Avatar4 from '../assets/avatars/avatar4.jpg';
import Avatar5 from '../assets/avatars/avatar5.png';
import Avatar6 from '../assets/avatars/avatar6.jpg';

const ProfileCard = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  // List of in-built avatar options using local images
  const avatarOptions = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatar) => {
    setEditedUser((prev) => ({ ...prev, avatar }));
  };

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
      {isEditing ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
          <div className="space-y-4">
            {/* Avatar Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Avatar</h3>
              <div className="grid grid-cols-3 gap-4">
                {avatarOptions.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className={`w-16 h-16 rounded-full cursor-pointer object-cover border-2 ${
                      editedUser.avatar === avatar ? 'border-blue-500' : 'border-transparent'
                    }`}
                    onClick={() => handleAvatarSelect(avatar)}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Avatar')} // Fallback
                  />
                ))}
              </div>
            </div>

            {/* Name and Email Inputs */}
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Email"
            />

            {/* Save and Cancel Buttons */}
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Avatar')} // Fallback
          />
          <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            <strong>Rank:</strong> {user.rank || 'Beginner'}
          </p>
          <div className="mt-4">
            <span>Posted Recipes: {user.postedRecipes}</span>
            <span className="ml-4">Liked Recipes: {user.likedRecipes}</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;