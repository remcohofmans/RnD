import React from 'react';

const AnimatedDots = ({ message = "Loading" }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="flex justify-center space-x-2">
        <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce delay-200"></div>
      </div>
      <p className="mt-4 text-xl text-gray-600 font-semibold">
        {message}
      </p>
    </div>
  </div>
);

export default AnimatedDots;
