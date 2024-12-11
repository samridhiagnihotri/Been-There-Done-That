import { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import FoodCard from './FoodCard';

const CategoryTemplate = ({ title, items }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[83vh] bg-gradient-to-b from-gray-1000 to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-pink-300 bg-clip-text text-transparent mb-8 text-center"
        >
          {title}
        </motion.h1>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <FoodCard key={item._id} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTemplate; 