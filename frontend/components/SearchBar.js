import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";

const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-8"
    >
      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border-2 border-pink-500 focus:outline-none focus:border-pink-600 pl-10"
        />
        <Search className="absolute left-3 top-2.5 text-pink-500" />
      </div>
    </motion.div>
  );
};

export default SearchBar; 