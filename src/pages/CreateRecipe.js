import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    image: null,
    prepTime: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setRecipe({ ...recipe, image: files[0] });
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      navigate('/dashboard', { state: { newRecipe: recipe } });
    } catch (err) {
      toast.error('Failed to create recipe');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create a New Recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={recipe.title}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1">Prep Time</label>
            <input
              type="text"
              name="prepTime"
              value={recipe.prepTime}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Recipe
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateRecipe;