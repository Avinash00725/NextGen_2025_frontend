
// import React from 'react';
// import { motion } from 'framer-motion';

// const RecipeList = ({ recipes }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//       {recipes.map((recipe) => (
//         <motion.div
//           key={recipe._id}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gray-800 text-white p-4 rounded-lg shadow-md"
//         >
//           <img
//             src={recipe.image || 'https://www.licious.in/blog/wp-content/uploads/2022/04/Chicken-Haleem-Cooked-min-compressed-600x400.jpg'} // Fallback to test image
//             alt={recipe.title}
//             className="w-full h-48 object-cover rounded mb-2"
//             onError={(e) => {
//               console.error('Image load failed for:', recipe.image || 'fallback');
//               e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
//             }}
//           />
//           {!recipe.image && <p className="text-gray-400">No image available</p>}
//           <h3 className="text-lg font-semibold">{recipe.title}</h3>
//           <p>Prep Time: {recipe.prepTime}</p>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default RecipeList;

import React from 'react';
import { motion } from 'framer-motion';

const RecipeList = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <motion.div
          key={recipe._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 text-white p-4 rounded-lg shadow-md"
        >
          {recipe.image ? (
            <img
              src={
                recipe.image.startsWith('http')
                  ? recipe.image
                  : `https://nextgen-2025-backend.onrender.com${recipe.image}`
              }
              alt={recipe.title}
              className="w-full h-48 object-cover rounded mb-2"
              onError={(e) => {
                console.error('Image load failed for:', recipe.image);
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
              onLoad={() => console.log('Image loaded successfully:', recipe.image)}
            />
          ) : (
            <p className="text-gray-400">No image available</p>
          )}
          <h3 className="text-lg font-semibold">{recipe.title}</h3>
          <p>Prep Time: {recipe.prepTime}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default RecipeList;