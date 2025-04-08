import React from 'react';

const RecipeList = ({ recipes, onDelete, loadingDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
        >
          <h3 className="text-lg font-semibold">{recipe.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Prep Time: {recipe.prepTime}</p>
          {recipe.image && (
            <img
              src={`https://nextgen-2025-backend.onrender.com${recipe.image}`}
              alt={recipe.title}
              className="w-full h-48 object-cover rounded mt-2"
            />
          )}
          <button
            onClick={() => onDelete(recipe._id)}
            disabled={loadingDelete === recipe._id}
            className={`mt-2 px-4 py-2 text-white rounded ${
              loadingDelete === recipe._id
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {loadingDelete === recipe._id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;