import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

const DistanceControl = ({ value, onChange, id = 'distance-input' }) => {
  const [distance, setDistance] = useState(parseInt(value) || 5);
  const [error, setError] = useState('');

  useEffect(() => {
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue) && parsedValue !== distance) {
      setDistance(parsedValue);
    }
  }, [value]);

  const handleChange = (newValue) => {
    setError('');

    if (newValue === '' || isNaN(newValue)) {
      setDistance(0);
      setError('Please enter a valid number');
      return;
    }

    const newDistance = Math.min(Math.max(1, parseInt(newValue)), 100);
    
    if (newDistance !== parseInt(newValue)) {
      setError('Value must be between 1 and 100');
    }

    setDistance(newDistance);
    onChange(newDistance.toString());
  };

  return (
    <div className="space-y-2">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col items-center gap-4">
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            Distance Range
          </label>
          
          <div className="flex items-center gap-4 w-full max-w-xs">
            <button
              type="button"
              onClick={() => handleChange(distance - 1)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Decrease distance"
              disabled={distance <= 1}
            >
              <Minus className="w-5 h-5 text-rose-600" />
            </button>

            <div className="relative flex-1">
              <input
                id={id}
                type="text" /* Changed from "number" to "text" */
                inputMode="numeric"
                pattern="[0-9]*"
                value={distance}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full text-3xl font-semibold text-center bg-transparent border-b-2 border-rose-200 focus:border-rose-500 focus:ring-0 p-2 text-rose-900"
                aria-describedby={error ? `${id}-error` : undefined}
              />
              <span className="absolute right-0 bottom-3 text-rose-400 text-lg" aria-hidden="true">
                km
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleChange(distance + 1)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 active:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Increase distance"
              disabled={distance >= 100}
            >
              <Plus className="w-5 h-5 text-rose-600" />
            </button>
          </div>

          {/* Range indicator */}
          <div className="w-full max-w-xs h-2 bg-rose-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-300 to-rose-600 transition-all duration-200"
              style={{ width: `${(distance / 100) * 100}%` }}
            />
          </div>

          <div className="flex justify-between w-full max-w-xs text-sm text-rose-500">
            <span>1 km</span>
            <span>100 km</span>
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

export default DistanceControl;
