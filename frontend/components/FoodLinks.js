
import React from "react";
import Link from "next/link";

const FoodLinks = () => {
  return (
    <>
      <div className="hidden md:flex items-center justify-center space-x-10  font-bold text-pink-400 mt-5">
        <Link href={"/foods/hotbeverage"}>
          <p className="hover:scale-125 transition duration-300 text-lg ease-in cursor-pointer">
            Hot beverage
          </p>
        </Link>
        <Link href={"/foods/coldbeverage"}>
          <p className="hover:scale-125 transition duration-300 text-lg ease-in cursor-pointer">
            Cold beverage
          </p>
        </Link>
        <Link href={"/foods/pasta"}>
          <p className="hover:scale-125 transition duration-300 text-lg ease-in cursor-pointer">
            Pasta
          </p>
        </Link>
        <Link href={"/foods/sides"}>
          <p className="hover:scale-125 transition duration-300 text-lg ease-in cursor-pointer">
            {" "}
            Sides
          </p>
        </Link>
        <Link href={"/foods/desserts"}>
          <p className="hover:scale-125 transition duration-300 text-lg ease-in cursor-pointer">
            Desserts
          </p>
        </Link>
      </div>
      <div className=" md:hidden flex items-center justify-center space-x-10 font-bold text-lg text-pink-600 mt-5">
        <Link href={"/foods"}>All Categories</Link>
      </div> 
    </>
  );
};

export default FoodLinks;
