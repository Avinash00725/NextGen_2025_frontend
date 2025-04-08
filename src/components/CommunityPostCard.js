import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CommunityPostCard = ({ post, onUpvote, onDownvote, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Function to render media based on type
  const renderMedia = () => {
    console.log('Post data:', post); // Debug the entire post object
    if (post.image) {
      const imageSrc = post.image.startsWith('http')
        ? post.image
        : `https://nextgen-2025-backend.onrender.com${post.image}`;
      console.log('Attempting to load image from:', imageSrc);
      return (
        <img
          src={imageSrc}
          alt={post.content || 'Post image'}
          className="w-full rounded mb-2 object-cover" // Removed fixed height, added object-cover
          style={{ aspectRatio: '16/9' }} // Maintains a common aspect ratio (e.g., 16:9)
          onError={(e) => {
            console.error('Image load failed for:', imageSrc, 'Error:', e);
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      );
    }
    if (post.video) {
      const isImageUrl = post.video.match(/\.(jpg|jpeg|png|gif)$/i) || post.video.includes('gstatic.com/images');
      if (isImageUrl) {
        const imageSrc = post.video;
        console.log('Treating video URL as image:', imageSrc);
        return (
          <img
            src={imageSrc}
            alt={post.content || 'Post image'}
            className="w-full rounded mb-2 object-cover"
            style={{ aspectRatio: '16/9' }}
            onError={(e) => {
              console.error('Image load failed for misinterpreted video:', imageSrc, 'Error:', e);
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        );
      }
      const isYouTube = post.video.includes('youtube.com') || post.video.includes('youtu.be');
      const isVimeo = post.video.includes('vimeo.com');
      if (isYouTube) {
        const videoId = post.video.match(/[?&]v=([^&]+)/)?.[1] || post.video.split('/').pop();
        return (
          <iframe
            width="100%"
            height="auto" // Dynamic height
            src={`https://www.youtube.com/embed/${videoId}`}
            title={post.content || 'YouTube video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full rounded mb-2"
            style={{ aspectRatio: '16/9' }} // Maintains 16:9 aspect ratio
          ></iframe>
        );
      } else if (isVimeo) {
        const videoId = post.video.match(/(\d+)/)?.[0];
        return (
          <iframe
            width="100%"
            height="auto"
            src={`https://player.vimeo.com/video/${videoId}`}
            title={post.content || 'Vimeo video'}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full rounded mb-2"
            style={{ aspectRatio: '16/9' }}
          ></iframe>
        );
      } else if (post.video.match(/\.(mp4|webm|ogg)$/i)) {
        return (
          <video controls className="w-full rounded mb-2 object-cover" style={{ aspectRatio: '16/9' }}>
            <source src={`https://nextgen-2025-backend.onrender.com${post.video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return <p className="text-red-500 mb-2">Unsupported video URL: {post.video}</p>;
      }
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
    >
      <div className="flex items-center mb-2">
        <span className="font-semibold text-gray-900 dark:text-white">{post.user.name}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{post.content}</p>
      {renderMedia()}
      <div className="flex space-x-4 mb-2">
        <button
          onClick={() => onUpvote(post._id)}
          className="text-green-500 hover:text-green-700"
        >
          ↑ {post.upvotes || 0}
        </button>
        <button
          onClick={() => onDownvote(post._id)}
          className="text-red-500 hover:text-red-700"
        >
          ↓ {post.downvotes || 0}
        </button>
      </div>
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-blue-500 hover:text-blue-700 mb-2"
      >
        {showComments ? 'Hide Comments' : `Comments (${post.comments.length})`}
      </button>
      {showComments && (
        <div className="mt-2">
          {post.comments.map((comment, index) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <strong>{comment.user.name}:</strong> {comment.text}
            </p>
          ))}
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Add a comment..."
            />
            <button
              onClick={() => {
                if (commentText.trim()) {
                  onAddComment(post._id, commentText);
                  setCommentText('');
                }
              }}
              className="px-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommunityPostCard;