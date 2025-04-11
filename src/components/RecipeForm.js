import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RecipeForm = ({ onClose, onAddRecipe }) => {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    procedure: '',
    image: null, // Changed to file input
    videoUrl: '', // URL input
    cookingTime: '', // Renamed to match UserDashboard
  });
  const [error, setError] = useState(''); // State for error message

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => {
      if (name === 'image') {
        return { ...prev, [name]: files[0] }; // Handle file input
      }
      return { ...prev, [name]: value }; // Handle text inputs
    });
    // Clear error when user starts providing media
    if (name === 'image' || name === 'videoUrl') setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate that at least one media field is provided
    if (!formData.image && !formData.videoUrl.trim()) {
      setError('Please provide at least an image or video URL.');
      return;
    }
    setError(''); // Clear error if validation passes
    onAddRecipe({
      ...formData,
      id: Date.now(),
      likes: 0,
      prepTime: formData.cookingTime, // Use cookingTime as prepTime
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Add New Recipe</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Name of the Recipe"
            required
          />
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Ingredients (e.g., 1 cup rice, 2 tsp salt)"
            required
          />
          <textarea
            name="procedure"
            value={formData.procedure}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Procedure (step-by-step instructions)"
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Video URL (e.g., https://youtube.com/watch?v=videoId)"
          />
          <input
            type="text"
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Expected Cooking Time (e.g., 30 mins)"
            required
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Recipe
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RecipeForm;