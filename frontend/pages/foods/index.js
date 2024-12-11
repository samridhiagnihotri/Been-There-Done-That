import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Coffee, LocalCafe, Restaurant, BakeryDining, Cake, Search } from "@mui/icons-material";
import Chatbot from '../../components/Chatbot';
import FoodLinks from '../../components/FoodLinks';

const Foods = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { 
      name: "Hot Beverage", 
      href: "/foods/hotbeverage", 
      Icon: Coffee,
      description: "Warm your soul with our signature coffee blends"
    },
    { 
      name: "Cold Beverage", 
      href: "/foods/coldbeverage", 
      Icon: LocalCafe,
      description: "Cool down with our refreshing iced coffees"
    },
    { 
      name: "Pasta", 
      href: "/foods/pasta", 
      Icon: Restaurant,
      description: "Authentic Italian pasta made with love"
    },
    { 
      name: "Sides", 
      href: "/foods/sides", 
      Icon: BakeryDining,
      description: "Perfect companions for your beverages"
    },
    { 
      name: "Desserts", 
      href: "/foods/desserts", 
      Icon: Cake,
      description: "Sweet treats to complete your experience"
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-[83vh] bg-gradient-to-b from-gray-1000 to-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-pink-300 bg-clip-text text-transparent mb-6">
              Explore Our Menu
            </h1>
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border-2 border-pink-500 focus:outline-none focus:border-pink-600 pl-10"
              />
              <Search className="absolute left-3 top-2.5 text-pink-500" />
            </div>
          </motion.div>

          <FoodLinks />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredCategories.map((category, index) => {
              const Icon = category.Icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={category.href}>
                    <div className="bg-gray-900 hover:bg-gray-700 rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-pink-500/20">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-pink-500 rounded-lg mr-4">
                          {Icon && <Icon className="text-white text-2xl" />}
                        </div>
                        <h2 className="text-xl font-bold text-pink-400">
                          {category.name}
                        </h2>
                      </div>
                      <p className="text-pink-100 opacity-70">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

         
        </div>
      </div>
      <Chatbot />
    </>
  );
};

export default Foods;
