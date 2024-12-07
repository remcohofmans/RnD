import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { supabase } from '../../lib/helper/supabaseClient';

const fetchUserSubscription = async (userID) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('subscription')
      .eq('user_id', userID)
      .single();

    return data?.subscription || 'TRIAL';
  } catch (err) {
    console.error('Subscription fetch error:', err);
    return 'TRIAL';
  }
};

const WheelComponent = ({
  userID,  
  users,
  currentIndex,
  mustSpin,
  setMustSpin,
  handleWheelStop,
  setCurrentIndex,
  theme = 'pink',
}) => {
  const [spinCount, setSpinCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [userSubscription, setUserSubscription] = useState('TRIAL');

  const MAX_SPINS = userSubscription === 'ELITE' ? 40 
                  : userSubscription === 'GEVORDERD' ? 20 
                  : 10;

  useEffect(() => {
    const loadData = async () => {
      if (!userID) return;

      const subscription = await fetchUserSubscription(userID);
      setUserSubscription(subscription);

      const { data, error } = await supabase
        .from('spins')
        .select('spin_count')
        .eq('user_id', userID)
        .single();

      if (error) {
        console.error('Spin count fetch error:', error);
        return;
      }

      setSpinCount(data?.spin_count || 0);
    };

    loadData();
  }, [userID]);

  const handleSpinClick = async () => {
    if (spinCount >= MAX_SPINS) {
      setShowWarning(true);
      return;
    }

    if (!mustSpin) {
      const newIndex = Math.floor(Math.random() * users.length);
      setCurrentIndex(newIndex);
      setMustSpin(true);

      try {
        const { error } = await supabase
          .from('spins')
          .upsert([{ 
            user_id: userID, 
            spin_count: spinCount + 1 
          }], { onConflict: 'user_id' });

        if (error) throw error;
        setSpinCount(prev => prev + 1);
      } catch (err) {
        console.error('Spin update error:', err);
      }
    }
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  const themeStyles = {
    pink: {
      segmentColors: ['#fff1f2', '#fb7185', '#881337'],
      buttonGradient: 'from-rose-500 to-rose-700',
      buttonShadow: 'shadow-[0_12px_0_#9f1239]',
      buttonBorder: 'border-rose-300',
      activeShadow: 'shadow-[0_6px_0_#9f1239]',
    },
    green: {
      segmentColors: ['#e6f4ea', '#34d399', '#064e3b'],
      buttonGradient: 'from-green-500 to-green-700',
      buttonShadow: 'shadow-[0_12px_0_#065f46]',
      buttonBorder: 'border-green-300',
      activeShadow: 'shadow-[0_6px_0_#065f46]',
    },
  };

  const currentTheme = themeStyles[theme];

  const wheelData = users.map((user, index) => ({
    option: user.name,
    style: {
      backgroundColor: currentTheme.segmentColors[index % 3],
      textColor: index % 3 === 0 ? currentTheme.segmentColors[2] : currentTheme.segmentColors[0],
    },
  }));

  return (
<div className="flex flex-col items-center justify-center space-y-4">
    {showWarning && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Spin Limiet Bereikt!</h2>
          <p className="mb-4">U heeft alle {MAX_SPINS} beschikbare spins gebruikt voor uw {userSubscription} abonnement.</p>
          <button
            onClick={handleCloseWarning}
            className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition"
          >
            Sluiten
          </button>
        </div>
      </div>
    )}

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
        textShadow="1px 1px 5px bg-black bg-opacity-60"
        textColor="text-white"
        animationDuration={3000}
        spinEase="ease-out"
        wheelSize={300}
        onStartSpinning={() => console.log('Wheel started spinning!')}
      />

      <button
        className={`absolute top-[47%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full 
          bg-gradient-to-br ${currentTheme.buttonGradient} 
          ${currentTheme.buttonShadow} 
          ${currentTheme.buttonBorder} 
          text-white font-bold z-10 
          flex items-center justify-center 
          pulse-animation
          active:translate-y-[6px] active:${currentTheme.activeShadow}
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
    
    <div className="text-lg font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
        Spins: {spinCount}/{MAX_SPINS} ({userSubscription})
  </div>
</div>
  );
};

export default WheelComponent;