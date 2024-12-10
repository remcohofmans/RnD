import React, { useEffect, useState } from 'react';

const themeStyles = {
  pink: {
    alertBackground: 'bg-rose-100',
    alertText: 'text-rose-800',
    countdownText: 'text-rose-600',
  },
  green: {
    alertBackground: 'bg-green-100',
    alertText: 'text-green-800',
    countdownText: 'text-green-600',
  },
};

const CustomAlert = ({ message, theme = 'pink' }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      window.location.reload();
    } else {
      const timer = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const currentTheme = themeStyles[theme];

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className={`${currentTheme.alertBackground} ${currentTheme.alertText} p-6 rounded-lg shadow-xl max-w-xs w-full text-center`}>
        <p className="text-lg font-semibold">{message}</p>
        <p className={`mt-2 text-sm ${currentTheme.countdownText}`}>
          Pagina zal opnieuw laden in {countdown}...
        </p>
      </div>
    </div>
  );
};

export default CustomAlert;
