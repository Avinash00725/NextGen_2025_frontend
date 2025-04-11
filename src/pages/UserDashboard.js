import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import RecipeList from '../components/RecipeList';
import RecipeForm from '../components/RecipeForm';
import toast from 'react-hot-toast';
import { getUserProfile, updateUserProfile, getUserRecipes, createRecipe, getNotifications } from '../api';

const socket = io('https://nextgen-2025-backend.onrender.com');

const UserDashboard = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getUserProfile()
      .then((res) => setUser(res.data))
      .catch((err) => {
        toast.error('Failed to load user profile');
        console.error('Error fetching user profile:', err.response?.data?.message || err.message);
      });

    getUserRecipes()
      .then((res) => {
        console.log('Fetched recipes (full response):', JSON.stringify(res.data, null, 2)); // Pretty print full response
        res.data.forEach((recipe, index) => {
          console.log(`Recipe ${index + 1} - Image field:`, recipe.image, 'Type:', typeof recipe.image);
        });
        setRecipes(res.data);
      })
      .catch((err) => {
        console.error('Error fetching recipes:', err.response?.data?.message || err.message);
        toast.error('Failed to load recipes');
      });

    getNotifications()
      .then((res) => {
        console.log('Fetched notifications:', res.data);
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error('Error fetching notifications:', err.response?.data?.message || err.message);
        toast.error('Failed to load notifications');
      });

    socket.on('newNotification', (notification) => {
      console.log('New notification received:', notification);
      setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    });

    return () => socket.off('newNotification');
  }, []);

  const getUserRank = (postedRecipes) => {
    if (postedRecipes >= 16) return 'Legendary Chef';
    if (postedRecipes >= 11) return 'Master Chef';
    if (postedRecipes >= 6) return 'Professional Chef';
    if (postedRecipes >= 1) return 'Pro';
    return 'Beginner';
  };

  const updateUserProfileHandler = async (updatedUser) => {
    try {
      const res = await updateUserProfile(updatedUser);
      setUser(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', err.response?.data?.message || err.message);
    }
  };

  const handleAddRecipe = useCallback(async (newRecipe) => {
    try {
      const formData = new FormData();
      formData.append('title', newRecipe.title);
      formData.append('prepTime', newRecipe.prepTime);
      if (newRecipe.ingredients) formData.append('ingredients', newRecipe.ingredients);
      if (newRecipe.procedure) formData.append('procedure', newRecipe.procedure);
      if (newRecipe.image) {
        formData.append('image', newRecipe.image);
        console.log('Uploading image file:', newRecipe.image.name, 'Size:', newRecipe.image.size, 'Type:', newRecipe.image.type);
      }
      if (newRecipe.videoUrl) formData.append('videoUrl', newRecipe.videoUrl);

      console.log('FormData entries:', Array.from(formData.entries())); // Log all FormData keys and values
      const res = await createRecipe(formData);
      console.log('Create recipe response (full):', JSON.stringify(res.data, null, 2)); // Pretty print response
      setRecipes((prev) => [...prev, res.data]);
      setUser((prev) => ({
        ...prev,
        postedRecipes: prev.postedRecipes + 1,
        rank: getUserRank(prev.postedRecipes + 1),
      }));
      toast.success('Recipe added successfully!');
    } catch (err) {
      toast.error('Failed to add recipe');
      console.error('Error adding recipe:', err.response?.data?.message || err.message, err.response?.status);
    }
  }, []);

  useEffect(() => {
    if (location.state?.newRecipe) {
      handleAddRecipe(location.state.newRecipe);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location, handleAddRecipe]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar notifications={notifications} />
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[1280px] mx-auto"
        >
          <ProfileCard user={{ ...user, rank: getUserRank(user.postedRecipes) }} onUpdate={updateUserProfileHandler} />
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Posted Recipes</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search your recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowRecipeForm(true)}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Recipe
            </button>
            {filteredRecipes.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400">No recipes found. Start adding some!</p>
            ) : (
              <RecipeList recipes={filteredRecipes} />
            )}
          </section>
        </motion.div>
      </div>
      {showRecipeForm && (
        <RecipeForm
          onClose={() => setShowRecipeForm(false)}
          onAddRecipe={handleAddRecipe}
        />
      )}
    </div>
  );
};

export default UserDashboard;