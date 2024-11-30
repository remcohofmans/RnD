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
    
    if (newValue === '' || isNaN(newValue)) {
      setError('Please enter a valid number');
      return;
    }

    const newMin = Math.min(Math.max(18, parseInt(newValue)), maxAge);
    setMinAge(newMin);
    onChangeMin(newMin.toString());
  };

  const handleChangeMax = (newValue) => {
    setError('');

    if (newValue === '' || isNaN(newValue)) {
      setError('Please enter a valid number');
      return;
    }

    const newMax = Math.min(Math.max(minAge, parseInt(newValue)), 100);
    setMaxAge(newMax);
    onChangeMax(newMax.toString());
  };

  return (
    <div className="space-y-2">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-md">
        <div className="flex-1 space-y-2">
              <span className="text-sm text-gray-500">Min Age</span>
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
                    value={minAge}
                    onChange={(e) => handleChangeMin(e.target.value)}
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

            {/* Maximum age control */}
            <div className="flex-1 space-y-2">
              <span className="text-sm text-gray-500">Max Age</span>
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
                    value={maxAge}
                    onChange={(e) => handleChangeMax(e.target.value)}
                    className="w-full text-2xl font-semibold text-center bg-transparent border-b-2 border-rose-200 focus:border-rose-500 focus:ring-0 p-2 text-rose-900"
                    aria-label="Maximum age"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleChangeMax((maxAge + 1).toString())}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Increase maximum age"
                  disabled={maxAge >= 100}
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
