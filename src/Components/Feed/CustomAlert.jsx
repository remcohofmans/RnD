import React, { useEffect, useState } from 'react';

const CustomAlert = ({ message }) => {
  const [countdown, setCountdown] = useState(3); // Start countdown from 3 seconds

  useEffect(() => {
    if (countdown === 0) {
      // Trigger page reload when countdown reaches 0
      window.location.reload();
    } else {
      const timer = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1); // Decrease countdown by 1 every second
      }, 1000);

      return () => clearTimeout(timer); // Cleanup the timeout when component unmounts
    }
  }, [countdown]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-rose-100 text-rose-800 p-6 rounded-lg shadow-xl max-w-xs w-full text-center">
        <p className="text-lg font-semibold">{message}</p>
        <p className="mt-2 text-sm text-rose-600">
          Page will refresh in {countdown}...
        </p>
      </div>
    </div>
  );
};

export default CustomAlert;
