import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faSwimmer, faFilm, faBook, faHiking, faPenFancy, faCamera, faMusic, faPaintBrush, faBiking, faUtensils, faRunning, faChess, faDumbbell, faGuitar, faTree, faPlane, faSkiing, faGamepad, faDrum, faTheaterMasks, faRocket, faHorse, faFish, faBowlingBall, faFootballBall
} from '@fortawesome/free-solid-svg-icons';

const availableHobbies = {
  Sport: [
    { name: 'Zwemmen', icon: faSwimmer },
    { name: 'Wandelen', icon: faHiking },
    { name: 'Fietsen', icon: faBiking },
    { name: 'Hardlopen', icon: faRunning },
    { name: 'Fitness', icon: faDumbbell },
    { name: 'Skiën', icon: faSkiing },
    { name: 'Paardrijden', icon: faHorse },
    { name: 'Vissen', icon: faFish },
    { name: 'Bowlen', icon: faBowlingBall },
    { name: 'Voetbal', icon: faFootballBall },
  ],
  Muziek: [
    { name: 'Muziek luisteren', icon: faMusic },
    { name: 'Gitaar spelen', icon: faGuitar },
    { name: 'Drummen', icon: faDrum },
  ],
  Kunst: [
    { name: 'Schilderen', icon: faPaintBrush },
    { name: 'Fotografie', icon: faCamera },
    { name: 'Schrijven', icon: faPenFancy },
    { name: 'Toneelspelen', icon: faTheaterMasks },
  ],
  Overige: [
    { name: 'Films kijken', icon: faFilm },
    { name: 'Lezen', icon: faBook },
    { name: 'Videospellen', icon: faGamepad },
    { name: 'Tuinieren', icon: faTree },
    { name: 'Reizen', icon: faPlane },
    { name: 'Koken', icon: faUtensils },
    { name: 'Schaken', icon: faChess },
    { name: 'Modelvliegtuigen', icon: faRocket },
  ],
};

const HobbiesModal = ({ showModal, setShowModal, selectedHobbies, setSelectedHobbies }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const categories = Object.keys(availableHobbies);
  const currentCategory = categories[currentCategoryIndex];

  const handleHobbyToggle = (category, hobby) => {
    const hobbyKey = `${category}:${hobby.name}`;
    setSelectedHobbies((prevSelected) =>
      prevSelected.includes(hobbyKey)
        ? prevSelected.filter((item) => item !== hobbyKey)
        : [...prevSelected, hobbyKey]
    );
  };

  const nextCategory = () => {
    setCurrentCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentCategoryIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
  };

  return (
    <div className={`fixed inset-0 bg-[#360009] bg-opacity-75 flex justify-center items-center ${showModal ? '' : 'hidden'}`}>
      <div className="bg-[#F0E9EA] rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-[#360009]">Selecteer je hobby's</h2>
        <h3 className="text-xl font-semibold mt-4 text-[#F43F5E]">{currentCategory}</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {availableHobbies[currentCategory].map((hobby) => (
            <button
              key={hobby.name}
              className={`flex items-center border p-2 rounded-lg ${
                selectedHobbies.includes(`${currentCategory}:${hobby.name}`) ? 'bg-[#FB7185]' : 'hover:bg-[#FFBEC8]'
              }`}
              onClick={() => handleHobbyToggle(currentCategory, hobby)}
            >
              <span className="mr-2"><FontAwesomeIcon icon={hobby.icon} /></span>
              {hobby.name}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button className="bg-[#F43F5E] text-white px-4 py-2 rounded-lg" onClick={prevCategory}>Vorige</button>
          <button className="bg-[#F43F5E] text-white px-4 py-2 rounded-lg" onClick={nextCategory}>Volgende</button>
          <button className="bg-[#360009] text-white px-4 py-2 rounded-lg" onClick={() => setShowModal(false)}>Sluiten</button>
        </div>
      </div>
    </div>
  );
};

const HobbiesSelection = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  return (
    <div>
      <button className="flex items-center bg-[#F43F5E] text-white px-4 py-2 rounded-lg" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Voeg Hobby's Toe
      </button>
      <HobbiesModal showModal={showModal} setShowModal={setShowModal} selectedHobbies={selectedHobbies} setSelectedHobbies={setSelectedHobbies} />
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-[#360009]">Geselecteerde Hobby's:</h3>
        <div className="flex flex-wrap mt-2">
          {selectedHobbies.map((hobbyKey) => {
            const [category, hobbyName] = hobbyKey.split(':');
            const hobby = availableHobbies[category].find((h) => h.name === hobbyName);
            return (
              <span key={hobbyKey} className="flex items-center border p-2 rounded-lg m-1 bg-[#FFBEC8] text-[#360009]">
                <span className="mr-2"><FontAwesomeIcon icon={hobby.icon} /></span>
                {hobby.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FilterForm = () => {
  const [restriction, setRestriction] = useState('');
  const [interest, setInterest] = useState('');
  const [physical, setPhysical] = useState('');
  const [facility, setFacility] = useState('');

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-[#F0E9EA] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#360009]">Filter</h2>
      <div className="mb-4">
        <label className="block text-[#360009]">Beperking</label>
        <input
          type="text"
          value={restriction}
          onChange={(e) => setRestriction(e.target.value)}
          className="mt-1 block w-full rounded-md border-[#FB7185] shadow-sm focus:border-[#F43F5E] focus:ring-[#F43F5E]"
        />
      </div>
      <div className="mb-4">
        <label className="block text-[#360009]">Interesse</label>
        <div className="mt-2 space-y-2">
          <label>
            <input
              type="radio"
              value="Man"
              checked={interest === 'Man'}
              onChange={(e) => setInterest(e.target.value)}
              className="mr-2"
            />
            Man
          </label>
          <label>
            <input
              type="radio"
              value="Vrouw"
              checked={interest === 'Vrouw'}
              onChange={(e) => setInterest(e.target.value)}
              className="mr-2"
            />
            Vrouw
          </label>
          <label>
            <input
              type="radio"
              value="Geen voorkeur"
              checked={interest === 'Geen voorkeur'}
              onChange={(e) => setInterest(e.target.value)}
              className="mr-2"
            />
            Geen voorkeur
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[#360009]">Fysiek?</label>
        <div className="mt-2 space-y-2">
          <label>
            <input
              type="radio"
              value="Ja"
              checked={physical === 'Ja'}
              onChange={(e) => setPhysical(e.target.value)}
              className="mr-2"
            />
            Ja
          </label>
          <label>
            <input
              type="radio"
              value="Nee"
              checked={physical === 'Nee'}
              onChange={(e) => setPhysical(e.target.value)}
              className="mr-2"
            />
            Nee
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[#360009]">Faciliteit</label>
        <select
          value={facility}
          onChange={(e) => setFacility(e.target.value)}
          className="mt-1 block w-full rounded-md border-[#FB7185] shadow-sm focus:border-[#F43F5E] focus:ring-[#F43F5E]"
        >
          <option value="">Kies een faciliteit</option>
          <option value="Zwembad">Zwembad</option>
          <option value="Gym">Gym</option>
          <option value="Bibliotheek">Bibliotheek</option>
        </select>
      </div>
      <HobbiesSelection />
      <button className="bg-[#F43F5E] text-white px-4 py-2 rounded-lg mt-4">Bevestig</button>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-[#F0E9EA] flex items-center justify-center">
      <FilterForm />
    </div>
  );
};

export default App;
