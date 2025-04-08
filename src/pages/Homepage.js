import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RecipeCard from '../components/RecipeCard';
import LiveTicker from '../components/LiveTicker';
import HeroVideo from '../assets/hero-video.mp4';

const Homepage = () => {
  // Use static recipes array instead of fetching from backend
  const [recipes] = useState([
    { id: 1, title: 'Spicy Tacos', image: 'taco.png', likes: 120, prepTime: '20 mins' },
    { id: 2, title: 'Vegan Pasta', image: 'pasta.png', likes: 85, prepTime: '15 mins' },
    { id: 3, title: 'Chocolate Cake', image: 'cake.png', likes: 200, prepTime: '45 mins' },
    { id: 4, title: 'Chicken Biryani', image: 'biryani.jpg', likes: 150, prepTime: '40 mins' },
    { id: 5, title: 'Vanilla Ice Cream', image: 'icecream.jpg', likes: 90, prepTime: '15 mins' },
    { id: 6, title: 'Vegetable Pulav', image: 'pulav.png', likes: 110, prepTime: '30 mins' },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    // Placeholder for API call or WebSocket (not needed for static data)
  }, []);

  const handleStartSharing = () => {
    console.log('Navigating to User Dashboard...');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section with Reduced Height */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={HeroVideo}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-5xl font-bold text-white"
          >
            Share the Flavor, Cook Together
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 text-lg text-white"
          >
            Discover and share delicious recipes in real-time.
          </motion.p>
          <div className="mt-6 flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg text-base"
              onClick={handleStartSharing}
            >
              Start Sharing
            </motion.button>
            <Link
              to="/community"
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg text-base"
            >
              Community
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition text-base"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Trending Recipes - Grid Layout (3 Cards Per Row) */}
      <section className="py-12 px-4 md:px-8">
        <h2 className="text-3xl font-semibold text-center mb-8">Trending Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;