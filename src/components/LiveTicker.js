import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const socket = io('https://nextgen-2025-backend.onrender.com');

const LiveTicker = () => {
  const [updates, setUpdates] = useState([
    'John just shared Spicy Tacos!',
    'Emma liked a Vegan Pasta recipe.',
    'Alice added a Chicken Biryani recipe!',
    'Bob gave 5 stars to Vanilla Ice Cream!',
    'Sarah shared a Vegetable Pulav recipe!',
    'Mike commented on Chocolate Cake!',
    'Lisa added a new recipe to favorites!',
  ]);

  useEffect(() => {
    socket.on('newUpdate', (update) => {
      setUpdates((prev) => [update, ...prev.slice(0, 6)]); // Keep up to 7 updates
    });
    return () => socket.off('newUpdate');
  }, []);

  // Calculate duration based on number of updates (5 seconds per update)
  const tickerDuration = updates.length * 5;

  return (
    <div
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 overflow-hidden"
      onMouseEnter={(e) => e.currentTarget.querySelector('div').style.animationPlayState = 'paused'}
      onMouseLeave={(e) => e.currentTarget.querySelector('div').style.animationPlayState = 'running'}
    >
      <motion.div
        animate={{ x: ['100%', '-100%'] }}
        transition={{ repeat: Infinity, duration: tickerDuration, ease: 'linear' }}
        className="whitespace-nowrap"
      >
        {updates.map((update, index) => (
          <span
            key={index}
            className="mx-6 inline-block text-lg font-medium tracking-wide drop-shadow-md"
          >
            {update}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default LiveTicker;