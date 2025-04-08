// Import static images
import TacoImage from '../assets/taco.png';
import PastaImage from '../assets/pasta.png';
import CakeImage from '../assets/cake.png';
import BiryaniImage from '../assets/biryani.jpg';
import IcecreamImage from '../assets/icecream.jpg';
import PulavImage from '../assets/pulav.png';

// Map filenames to imported assets
const imageMap = {
  'taco.png': TacoImage,
  'pasta.png': PastaImage,
  'cake.png': CakeImage,
  'biryani.jpg': BiryaniImage,
  'icecream.jpg': IcecreamImage,
  'pulav.png': PulavImage,
};

// Function to get the correct image source
export const getImageSource = (image) => {
  // If the image is an uploaded file (starts with /uploads/), treat it as a URL
  if (image && image.startsWith('/uploads/')) {
    return `https://nextgen-2025-backend.onrender.com${image}`; // Backend serves uploaded images
  }
  // Otherwise, map it to a static asset
  return imageMap[image] || 'https://via.placeholder.com/300x200?text=Image+Not+Found';
};