import React from 'react';
import { motion } from 'framer-motion';
import { getImageSource } from '../utils/imageMap';

const RecipeCard = ({ _id, title, image, likes, prepTime, createdBy }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <img
        src={getImageSource(image)}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">by {createdBy?.name || 'Unknown'}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">{prepTime}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">❤️ {likes}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;