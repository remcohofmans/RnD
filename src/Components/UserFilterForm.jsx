import React, { useState } from 'react';

// Main Component
const UserFilterForm = () => {
  // State management for form fields
  const [beperking, setBeperking] = useState('');
  const [interesse, setInteresse] = useState('Geen voorkeur');
  const [fysiek, setFysiek] = useState(null);
  const [hobbies, setHobbies] = useState([]);
  const [faciliteit, setFaciliteit] = useState([]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Process the form data
    const formData = {
      beperking,
      interesse,
      fysiek,
      hobbies,
      faciliteit,
    };
    console.log('Form submitted:', formData);
    // You can add logic to send formData to a backend or perform other actions
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#E9E9F0] p-6 rounded-lg shadow-md w-80 mx-auto mt-12 space-y-4"
    >
      <div className="mb-4">
        <label className="block text-[#C5C3E0] font-semibold mb-2">Beperking</label>
        <input
          type="text"
          value={beperking}
          onChange={(e) => setBeperking(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[#C5C3E0] font-semibold mb-2">Interesse</label>
        <div className="flex space-x-4 mt-1">
          {['Man', 'Vrouw', 'Geen voorkeur'].map((option) => (
            <label key={option} className="inline-flex items-center text-[#333]">
              <input
                type="radio"
                value={option}
                checked={interesse === option}
                onChange={(e) => setInteresse(e.target.value)}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#C5C3E0] font-semibold mb-2">Fysiek?</label>
        <div className="flex space-x-4 mt-1">
          <label className="inline-flex items-center text-[#333]">
            <input
              type="radio"
              value="Ja"
              checked={fysiek === 'Ja'}
              onChange={() => setFysiek('Ja')}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Ja</span>
          </label>
          <label className="inline-flex items-center text-[#333]">
            <input
              type="radio"
              value="Nee"
              checked={fysiek === 'Nee'}
              onChange={() => setFysiek('Nee')}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Nee</span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#C5C3E0] font-semibold mb-2">Hobbies</label>
        <div className="flex space-x-2 mt-1">
          {/* Add buttons for each hobby as needed */}
          {['Hobby1', 'Hobby2', 'Hobby3'].map((hobby) => (
            <button
              key={hobby}
              type="button"
              className={`px-4 py-2 rounded-full transition duration-300 ${
                hobbies.includes(hobby)
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#C5C3E0] text-gray-800 hover:bg-blue-300'
              }`}
              onClick={() =>
                setHobbies((prev) =>
                  prev.includes(hobby)
                    ? prev.filter((h) => h !== hobby)
                    : [...prev, hobby]
                )
              }
            >
              {hobby}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#C5C3E0] font-semibold mb-2">Faciliteit</label>
        <select
          multiple
          value={faciliteit}
          onChange={(e) =>
            setFaciliteit(Array.from(e.target.selectedOptions, (option) => option.value))
          }
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        >
          {/* Add options for each faciliteit as needed */}
          <option value="Faciliteit 1">Faciliteit 1</option>
          <option value="Faciliteit 2">Faciliteit 2</option>
          <option value="Faciliteit 3">Faciliteit 3</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full w-full mt-4 transition duration-300 hover:from-blue-600 hover:to-indigo-700"
      >
        Bevestig
      </button>
    </form>
  );
};

export default UserFilterForm;
