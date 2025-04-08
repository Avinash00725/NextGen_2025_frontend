import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import CommunityPostCard from '../components/CommunityPostCard';
import { getPosts, createPost, upvotePost, downvotePost, addComment } from '../api';
import toast from 'react-hot-toast';

const socket = io('https://nextgen-2025-backend.onrender.com');

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    image: null,
    video: null,
    mediaUrl: '',
  });

  useEffect(() => {
    // Fetch initial posts
    getPosts()
      .then((res) => {
        console.log('Fetched posts:', res.data);
        setPosts(res.data);
      })
      .catch((err) => console.error('Error fetching posts:', err));

    // Listen for real-time updates
    socket.on('newPost', (post) => {
      console.log('New post received:', post); // Debug
      setPosts((prev) => [post, ...prev]);
    });

    socket.on('postUpdated', (updatedPost) => {
      console.log('Post updated received:', updatedPost); // Debug
      setPosts((prev) =>
        prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    });

    return () => {
      socket.off('newPost');
      socket.off('postUpdated');
    };
  }, []);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', newPost.content);
    if (newPost.image) formData.append('image', newPost.image);
    if (newPost.video) formData.append('video', newPost.video);
    if (newPost.mediaUrl) formData.append('mediaUrl', newPost.mediaUrl);

    try {
      const res = await createPost(formData);
      console.log('Post creation response:', res.data);
      setNewPost({ content: '', image: null, video: null, mediaUrl: '' });
      setShowPostForm(false);
      toast.success('Post created successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create post';
      toast.error(errorMessage);
      console.error('Post creation error:', err);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await upvotePost(id);
    } catch (err) {
      toast.error('Failed to upvote');
    }
  };

  const handleDownvote = async (id) => {
    try {
      await downvotePost(id);
    } catch (err) {
      toast.error('Failed to downvote');
    }
  };

  const handleAddComment = async (id, comment) => {
    try {
      console.log('Adding comment to post:', id, 'with text:', comment); // Debug
      const res = await addComment(id, { text: comment }); // Get response
      console.log('Comment add response:', res.data); // Debug response
      // Optimistically update the state (optional, depends on Socket.IO)
      setPosts((prev) =>
        prev.map((post) =>
          post._id === id ? { ...post, comments: res.data.comments } : post
        )
      );
      toast.success('Comment added successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add comment';
      toast.error(errorMessage);
      console.error('Comment add error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Community</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Share your recipes, give feedback, and connect with others!
        </p>
        <button
          onClick={() => setShowPostForm(true)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create New Post
        </button>
        <div className="space-y-6">
          {posts.map((post) => (
            <CommunityPostCard
              key={post._id}
              post={post}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onAddComment={handleAddComment}
            />
          ))}
        </div>

        {showPostForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowPostForm(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <textarea
                  name="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Share your recipe or thoughts..."
                  required
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={(e) => setNewPost({ ...newPost, video: e.target.files[0] })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="url"
                  name="mediaUrl"
                  value={newPost.mediaUrl}
                  onChange={(e) => setNewPost({ ...newPost, mediaUrl: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Enter media URL (image or video, e.g., YouTube, direct link)"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Community;