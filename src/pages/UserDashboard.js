import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import RecipeList from '../components/RecipeList';
import RecipeForm from '../components/RecipeForm';
import toast from 'react-hot-toast';
import { getUserProfile, updateUserProfile, getUserRecipes, createRecipe, deleteRecipe, getNotifications } from '../api';

const socket = io('https://nextgen-2025-backend.onrender.com');

const UserDashboard = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingDelete, setLoadingDelete] = useState(null);

  useEffect(() => {
    getUserProfile()
      .then((res) => setUser(res.data))
      .catch((err) => {
        toast.error('Failed to load user profile');
        console.error('Error fetching user profile:', err.response?.data?.message || err.message);
      });

    getUserRecipes()
      .then((res) => setRecipes(res.data))
      .catch((err) => {
        console.error('Error fetching recipes:', err.response?.data?.message || err.message);
        toast.error('Failed to load recipes');
      });

    getNotifications()
      .then((res) => {
        console.log('Fetched notifications:', res.data); // Debug
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error('Error fetching notifications:', err.response?.data?.message || err.message);
        toast.error('Failed to load notifications');
      });

    socket.on('newNotification', (notification) => {
      console.log('New notification received:', notification); // Debug
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
      if (newRecipe.image) {
        formData.append('image', newRecipe.image);
      }

      const res = await createRecipe(formData);
      setRecipes((prev) => [...prev, res.data]);
      setUser((prev) => ({
        ...prev,
        postedRecipes: prev.postedRecipes + 1,
        rank: getUserRank(prev.postedRecipes + 1),
      }));
      toast.success('Recipe added successfully!');
    } catch (err) {
      toast.error('Failed to add recipe');
      console.error('Error adding recipe:', err.response?.data?.message || err.message);
    }
  }, []);

  useEffect(() => {
    if (location.state?.newRecipe) {
      handleAddRecipe(location.state.newRecipe);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location, handleAddRecipe]);

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      console.log('Attempting to delete recipe with ID:', recipeId);
      console.log('Current token in localStorage:', localStorage.getItem('token'));
      setLoadingDelete(recipeId);
      try {
        const response = await deleteRecipe(recipeId);
        console.log('Delete response:', response.data);
        const [recipesRes, userRes] = await Promise.all([
          getUserRecipes(),
          getUserProfile(),
        ]);
        console.log('Refetched recipes:', recipesRes.data);
        console.log('Refetched user profile:', userRes.data);
        setRecipes(recipesRes.data);
        setUser(userRes.data);
        toast.success('Recipe deleted successfully!');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete recipe';
        console.error('Error deleting recipe:', errorMessage, err.response?.status, err.response?.data);
        toast.error(errorMessage);
      } finally {
        setLoadingDelete(null);
      }
    }
  };

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
          className="max-w-[1280px] mx-auto" // Fixed typo: maxcalc to max-w
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
              <RecipeList
                recipes={filteredRecipes}
                onDelete={handleDeleteRecipe}
                loadingDelete={loadingDelete}
              />
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