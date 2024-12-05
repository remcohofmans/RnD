import React from 'react';
import { Wheel } from 'react-custom-roulette';

const WheelComponent = ({
  users,
  currentIndex,
  mustSpin,
  setMustSpin,
  handleWheelStop,
  setCurrentIndex,
  theme = 'pink', // Default theme is pink
}) => {
  const themeStyles = {
    pink: {
      segmentColors: ['#fff1f2', '#fb7185', '#881337'],
      buttonGradient: 'from-rose-500 to-rose-700',
      buttonShadow: '0_12px_0_#9f1239',
      buttonBorder: 'border-rose-300',
    },
    green: {
      segmentColors: ['#e6f4ea', '#34d399', '#064e3b'],
      buttonGradient: 'from-green-500 to-green-700',
      buttonShadow: '0_12px_0_#065f46',
      buttonBorder: 'border-green-300',
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.pink;

  const wheelData = users.map((user, index) => ({
    option: user.name,
    style: {
      backgroundColor: currentTheme.segmentColors[index % 3],
      textColor: index % 3 === 0 ? currentTheme.segmentColors[2] : currentTheme.segmentColors[0],
    },
  }));

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newIndex = Math.floor(Math.random() * users.length);
      setCurrentIndex(newIndex);
      setMustSpin(true);
    }
  };

  return (
    <div className="relative mb-8 flex items-center justify-center">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={currentIndex}
        data={wheelData}
        onStopSpinning={handleWheelStop}
        radiusLineWidth={3}
        radiusLineColor="border-pink-500"
        outerBorderWidth={6}
        outerBorderColor={currentTheme.buttonBorder}
        fontSize={18}
        perpendicularText
        textDistance={85}
        backgroundColors={[
          'bg-gradient-to-r from-pink-200 via-rose-300 to-pink-100',
          'bg-gradient-to-r from-purple-200 via-pink-200 to-rose-100',
          'bg-gradient-to-r from-blue-200 via-blue-300 to-purple-200',
          'bg-gradient-to-r from-green-200 via-green-300 to-blue-100',
          'bg-gradient-to-r from-yellow-100 via-orange-200 to-amber-200',
          'bg-gradient-to-r from-indigo-200 via-blue-100 to-green-200',
        ]}
        textShadow="1px 1px 5px rgba(0, 0, 0, 0.6)"
        textColor="text-white"
        animationDuration={3000}
        spinEase="ease-out"
        wheelSize={300}
        onStartSpinning={() => console.log('Wheel started spinning!')}
      />

      <button
        className={`absolute top-[47%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full 
          bg-gradient-to-br ${currentTheme.buttonGradient} 
          shadow-[${currentTheme.buttonShadow}] ${currentTheme.buttonBorder} 
          text-white font-bold z-10 
          flex items-center justify-center 
          pulse-animation
          active:translate-y-[6px] active:shadow-[0_6px_0_#9f1239]
          hover:brightness-110 
          transition-all duration-300 
          disabled:opacity-50 disabled:cursor-not-allowed
          text-2xl tracking-wider`}
        onClick={handleSpinClick}
        disabled={mustSpin}
      >
        {mustSpin ? 'Draaien...' : 'SPIN'}
      </button>
    </div>
  );
};

export default WheelComponent;
