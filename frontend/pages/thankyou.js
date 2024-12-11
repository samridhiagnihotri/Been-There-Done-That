import React from "react";
import Link from "next/link";

const thankyou = () => {
  return (
    <>
      <div className="max-w-6xl mx-auto min-h-[83vh] p-3 flex flex-col justify-center items-center">
        <h1 className="text-pink-400 text-xl font-bold">
          Thank you for your Order..
        </h1>
        <h1 className="text-pink-100 font-semibold text-lg mt-3">
          Your food is getting ready...
        </h1>
        <Link href={"/foods"}>
          <button className="bg-pink-500 text-pink-100 mt-5 hover:bg-pink-100 hover:text-pink-400 transition duration-300 ease-in font-bold p-4 rounded-xl">
            Explore now
          </button>
        </Link>
      </div>
    </>
  );
};

export default thankyou;
