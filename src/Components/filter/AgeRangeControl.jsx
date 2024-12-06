import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';


const AgeRangeControl = ({ 
  minValue = '18', 
  maxValue = '35', 
  onChangeMin, 
  onChangeMax, 
  id = 'age-range' 
}) => {
  const [minAge, setMinAge] = useState(parseInt(minValue) || 18);
  const [maxAge, setMaxAge] = useState(parseInt(maxValue) || 35);
  const [error, setError] = useState('');

  useEffect(() => {
    const parsedMin = parseInt(minValue);
    const parsedMax = parseInt(maxValue);
    if (!isNaN(parsedMin) && parsedMin !== minAge) {
      setMinAge(parsedMin);
    }
    if (!isNaN(parsedMax) && parsedMax !== maxAge) {
      setMaxAge(parsedMax);
    }
  }, [minValue, maxValue]);

  const handleChangeMin = (newValue) => {
    setError('');
    // Allow empty input for free typing
    const parsedValue = newValue === '' ? '' : parseInt(newValue);
    setMinAge(parsedValue);
    onChangeMin(newValue); // Update the parent with the raw value
  };

  const handleChangeMax = (newValue) => {
    setError('');

    const parsedValue = newValue === '' ? '' : parseInt(newValue);
    setMaxAge(parsedValue);
    onChangeMax(newValue); 

  };

  const handleBlur = () => {
    let newMinAge = minAge;
    let newMaxAge = maxAge;
    let errorMessage = '';

    //  minAge to be at least 18
    if (newMinAge < 18) {
      newMinAge = 18;
      errorMessage = 'Minimum leeftijd bedraagt 18 jaar.';
    }

    //  maxAge to be at most 120
    if (newMaxAge > 120) {
      newMaxAge = 120;
      errorMessage = 'Maximum leeftijd bedraagt 120 jaar.';
    }

    // Ensure minAge is always less than maxAge
    if (newMinAge >= newMaxAge) {
      errorMessage = 'Minimum leeftijd kan maximum leeftijd niet overschrijden.';
      newMinAge = 18; // Adjust minAge to be smaller than maxAge
      newMaxAge =35;
    }

    // Update the state with the clamped values
    setMinAge(newMinAge);
    setMaxAge(newMaxAge);
    setError(errorMessage);

    // Update parent components with clamped values
    onChangeMin(newMinAge.toString());
    onChangeMax(newMaxAge.toString());
  };

  return (
    <div className="space-y-2">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-md">
            {/* Min Age control */}
            <div className="flex-1 space-y-2">
              <span className="text-sm text-gray-500">Minimum leeftijd</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleChangeMin((minAge - 1).toString())}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Decrease minimum age"
                  disabled={minAge <= 18}
                >
                  <Minus className="w-4 h-4 text-rose-600" />
                </button>

                <div className="relative flex-1">
                  <input
                    id={`${id}-min`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={minAge === '' ? '' : minAge} // Handle case where the value is empty
                    onChange={(e) => handleChangeMin(e.target.value)}
                    onBlur={handleBlur} // Trigger validation on blur
                    className="w-full text-2xl font-semibold text-center bg-transparent border-b-2 border-rose-200 focus:border-rose-500 focus:ring-0 p-2 text-rose-900"
                    aria-label="Minimum age"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleChangeMin((minAge + 1).toString())}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Increase minimum age"
                  disabled={minAge >= maxAge}
                >
                  <Plus className="w-4 h-4 text-rose-600" />
                </button>
              </div>
            </div>

            <div className="text-rose-300 text-2xl">-</div>

            {/* Max Age control */}
            <div className="flex-1 space-y-2">
              <span className="text-sm text-gray-500">Maximum leeftijd</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleChangeMax((maxAge - 1).toString())}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Decrease maximum age"
                  disabled={maxAge <= minAge}
                >
                  <Minus className="w-4 h-4 text-rose-600" />
                </button>

                <div className="relative flex-1">
                  <input
                    id={`${id}-max`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={maxAge === '' ? '' : maxAge} // Handle case where the value is empty
                    onChange={(e) => handleChangeMax(e.target.value)}
                    onBlur={handleBlur} // Trigger validation on blur
                    className="w-full text-2xl font-semibold text-center bg-transparent border-b-2 border-rose-200 focus:border-rose-500 focus:ring-0 p-2 text-rose-900"
                    aria-label="Maximum age"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleChangeMax((maxAge + 1).toString())}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Increase maximum age"
                  disabled={maxAge >= 120}
                >
                  <Plus className="w-4 h-4 text-rose-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p 
          id={`${id}-error`} 
          className="text-sm text-rose-600 text-center"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default AgeRangeControl;
