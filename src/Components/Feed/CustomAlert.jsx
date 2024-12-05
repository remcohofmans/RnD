import React, { useEffect, useState } from 'react';

const CustomAlert = ({ message }) => {
  const [countdown, setCountdown] = useState(3); 

  useEffect(() => {
    if (countdown === 0) {
    //hierdoor kan nu pagina wel herladen worden
      window.location.reload();
    } else {
      const timer = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1); 
      }, 1000);
    // verniewen
      return () => clearTimeout(timer);

    }
  }, [countdown]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-rose-100 text-rose-800 p-6 rounded-lg shadow-xl max-w-xs w-full text-center">
        <p className="text-lg font-semibold">{message}</p>
        <p className="mt-2 text-sm text-rose-600">
          Pagina zal opniew laden in {countdown}...
        </p>
      </div>
    </div>
  );
};

export default CustomAlert;
