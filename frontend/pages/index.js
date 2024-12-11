import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <>
      <div className="w-full mx-auto px-4 md:px-6 min-h-[83vh] grid md:grid-cols-2 gap-y-10">
        {/* Left Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-start flex-col h-full"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl md:text-5xl bg-gradient-to-r from-pink-600 to-pink-300 bg-clip-text text-transparent font-heading main-heading mb-2"
          >
            Why settle for less when the best is just a cup away?
          </motion.h1>
          <br></br>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-pink-100 opacity-70 mt-3 text-xl font-semibold mb-2"
          >
            Order the best coffee online from{" "}
            <br />
            <span className="text-pink-400 font-heading text-4xl md:text-5xl ml-1 logo tracking-wide">
              Bean there, done that
            </span>
            <br />
            whenever and wherever you like!
          </motion.p>
 
          <br />
          <Link href={"/foods"}>
            <button className="hover:bg-pink-400 hover:text-white bg-pink-200 text-pink-700 tracking-widest transition duration-300 ease-in-out font-bold p-3 rounded-lg cursor-pointer mt-4">
              Order Now
            </button>
          </Link>
        </motion.div>
        {/* Right Section */}
        <div className="h-full flex justify-center items-center">
          <img
            src="/pic6.jpeg"
            alt="Coffee beans"
            className="md:h-[700px] sm:h-[300px] h-60 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full mx-auto px-4 md:px-6 mt-20">
        <h2 className="text-3xl md:text-4xl text-center text-pink-400 font-bold tracking-wide mb-6">
          What Our Customers Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-pink-900 text-pink-100 p-6 rounded-lg shadow-md">
            <p className="font-semibold text-xl">"Best coffee I've ever tasted!"</p>
            <span className="text-pink-300 text-sm">- Jane Doe</span>
          </div>
          <div className="bg-pink-900 text-pink-100 p-6 rounded-lg shadow-md">
            <p className="font-semibold text-xl">
              "Quick delivery and excellent service!"
            </p>
            <span className="text-pink-300 text-sm">- John Smith</span>
          </div>
          <div className="bg-pink-900 text-pink-100 p-6 rounded-lg shadow-md">
            <p className="font-semibold text-xl">
              "Now I can't start my day without it."
            </p>
            <span className="text-pink-300 text-sm">- Emily Johnson</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-pink-800 text-white px-4 md:px-6 py-6 mt-20">
        <div className="w-full mx-auto grid md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold mb-2">About Us</h3>
            <p className="text-pink-200">
              Bean there, done that is dedicated to delivering premium coffee
              from the best beans around the world. With us, you’ll experience
              the perfect blend of taste, freshness, and convenience.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-xl font-bold mb-2">Stay Connected</h3>
            <p className="text-pink-200">
              Follow us on social media for the latest updates, new flavors, and special offers.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href={"https://facebook.com"}>
                <a className="hover:text-pink-300 transition duration-200">Facebook</a>
              </Link>
              <Link href={"https://instagram.com"}>
                <a className="hover:text-pink-300 transition duration-200">Instagram</a>
              </Link>
              <Link href={"https://twitter.com"}>
                <a className="hover:text-pink-300 transition duration-200">Twitter</a>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
