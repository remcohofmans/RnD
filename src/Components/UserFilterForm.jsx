import React, { useState } from 'react';
import Modal from 'react-modal';

// List of hobbies in Dutch
const availableHobbies = [
  'Zwemmen', 
  'Films kijken', 
  'Lezen', 
  'Wandelen', 
  'Schrijven', 
  'Fotografie'
];

// Modal Styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '500px',
  },
};

// Main Component
const UserFilterForm = () => {
  const [beperking, setBeperking] = useState('');
  const [interesse, setInteresse] = useState('Geen voorkeur');
  const [fysiek, setFysiek] = useState(null);
  const [hobbies, setHobbies] = useState([]);
  const [faciliteit, setFaciliteit] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      beperking,
      interesse,
      fysiek,
      hobbies,
      faciliteit,
    };
    console.log('Form submitted:', formData);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const toggleHobby = (hobby) => {
    setHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
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
          {hobbies.map((hobby, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-600 text-white rounded-full"
            >
              {hobby}
            </span>
          ))}
          <button
            type="button"
            onClick={openModal}
            className="px-4 py-2 bg-[#C5C3E0] text-gray-800 rounded-full hover:bg-blue-300 transition duration-300"
          >
            +
          </button>
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Select Hobbies"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Selecteer Hobbies</h2>
        <div className="space-y-2">
          {availableHobbies.map((hobby) => (
            <div key={hobby} className="flex items-center">
              <input
                type="checkbox"
                checked={hobbies.includes(hobby)}
                onChange={() => toggleHobby(hobby)}
                className="form-checkbox text-blue-600"
              />
              <span className="ml-2">{hobby}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full transition duration-300 hover:from-blue-600 hover:to-indigo-700"
          >
            Sluiten
          </button>
        </div>
      </Modal>
    </form>
  );
};

export default UserFilterForm;
