import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-custom bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
