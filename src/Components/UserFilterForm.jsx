import React, { useState, useEffect } from 'react';

import DistanceControl from './DistanceControl';
import AgeRangeControl from './AgeRangeControl';


const availableHobbies = [
  // Collectie & Leren
  { name: 'Geschiedenis', icon: '📜', category: 'Leren' },
  { name: 'Munten verzamelen', icon: '🪙', category: 'Leren' },
  { name: 'Postzegels verzamelen', icon: '📫', category: 'Leren' },
  { name: 'Talen leren', icon: '🗣️', category: 'Leren' },

  // Creatief & Artistiek
  { name: 'Beeldhouwen', icon: '🗿', category: 'Creatief' },
  { name: 'Breien', icon: '🧶', category: 'Creatief' },
  { name: 'Gitaar spelen', icon: '🎸', category: 'Creatief' },
  { name: 'Haken', icon: '🪢', category: 'Creatief' },
  { name: 'Handlettering', icon: '🖋️', category: 'Creatief' },
  { name: 'Kalligrafie', icon: '✒️', category: 'Creatief' },
  { name: 'Keramiek', icon: '🏺', category: 'Creatief' },
  { name: 'Naaien', icon: '🧵', category: 'Creatief' },
  { name: 'Origami', icon: '📄', category: 'Creatief' },
  { name: 'Piano spelen', icon: '🎹', category: 'Creatief' },
  { name: 'Schilderen', icon: '🎨', category: 'Creatief' },
  { name: 'Schrijven', icon: '✍️', category: 'Creatief' },
  { name: 'Tekenen', icon: '🖍️', category: 'Creatief' },
  { name: 'Fotografie', icon: '📷', category: 'Creatief' },
  { name: 'Drummen', icon: '🥁', category: 'Creatief' },

  // Entertainment & Media
  { name: 'Bordspellen', icon: '🎲', category: 'Media' },
  { name: 'Films kijken', icon: '🎬', category: 'Media' },
  { name: 'Gamen', icon: '🎮', category: 'Media' },
  { name: 'Kaartspellen', icon: '🃏', category: 'Media' },
  { name: 'Lezen', icon: '📚', category: 'Media' },
  { name: 'Podcasts luisteren', icon: '🎧', category: 'Media' },
  { name: 'Puzzelen', icon: '🧩', category: 'Media' },
  { name: 'Series kijken', icon: '📺', category: 'Media' },
  { name: 'Schaken', icon: '♟️', category: 'Media' },
  { name: 'Stripboeken lezen', icon: '📖', category: 'Media' },

  // Voedsel & Drank
  { name: 'Barista', icon: '☕', category: 'Voedsel' },
  { name: 'Bakken', icon: '🥖', category: 'Voedsel' },
  { name: 'Cocktails maken', icon: '🍸', category: 'Voedsel' },
  { name: 'Koken', icon: '👨‍🍳', category: 'Voedsel' },
  { name: 'Wijnproeven', icon: '🍷', category: 'Voedsel' },
  { name: 'Bierbrouwen', icon: '🍺', category: 'Voedsel' },

  // Buiten & Natuur
  { name: 'Fotografie natuur', icon: '📸', category: 'Natuur' },
  { name: 'Kamperen', icon: '⛺', category: 'Natuur' },
  { name: 'Sterrenkijken', icon: '🔭', category: 'Natuur' },
  { name: 'Tuinieren', icon: '🌱', category: 'Natuur' },
  { name: 'Vissen', icon: '🎣', category: 'Natuur' },
  { name: 'Vogelspotten', icon: '🦅', category: 'Natuur' },
  { name: 'Naar zee gaan', icon: '🏖️', category: 'Natuur' },

  // Sociaal & Gemeenschap
  { name: 'Debatteren', icon: '🗣️', category: 'Sociaal' },
  { name: 'Improvisatie', icon: '🎪', category: 'Sociaal' },
  { name: 'Theater', icon: '🎭', category: 'Sociaal' },
  { name: 'Vrijwilligerswerk', icon: '🤝', category: 'Sociaal' },
  { name: 'Zingen', icon: '🎤', category: 'Sociaal' },

  // Sport
  { name: 'Basketball', icon: '🏀', category: 'Sport' },
  { name: 'Boksen', icon: '🥊', category: 'Sport' },
  { name: 'Dansen', icon: '💃', category: 'Sport' },
  { name: 'Fietsen', icon: '🚴‍♂️', category: 'Sport' },
  { name: 'Fitness', icon: '💪', category: 'Sport' },
  { name: 'Hardlopen', icon: '🏃‍♂️', category: 'Sport' },
  { name: 'Hockey', icon: '🏑', category: 'Sport' },
  { name: 'Klimmen', icon: '🧗‍♀️', category: 'Sport' },
  { name: 'Paardrijden', icon: '🏇', category: 'Sport' },
  { name: 'Skiën', icon: '⛷️', category: 'Sport' },
  { name: 'Skateboarden', icon: '🛹', category: 'Sport' },
  { name: 'Surfen', icon: '🏄‍♂️', category: 'Sport' },
  { name: 'Tennis', icon: '🎾', category: 'Sport' },
  { name: 'Volleybal', icon: '🏐', category: 'Sport' },
  { name: 'Vechtsport', icon: '🥋', category: 'Sport' },
  { name: 'Wandelen', icon: '🚶‍♂️', category: 'Sport' },
  { name: 'Zwemmen', icon: '🏊‍♂️', category: 'Sport' },

  // Technologie
  { name: 'bouwen', icon: '🛠️', category: 'Technologie' },
  { name: 'computer', icon: '💻', category: 'Technologie' },

  // Reizen
  { name: 'Backpacken', icon: '🎒', category: 'Reizen' },
  { name: 'Culturen ontdekken', icon: '🌍', category: 'Reizen' },
  { name: 'Reizen', icon: '✈️', category: 'Reizen' },
  { name: 'Taaluitwisseling', icon: '💭', category: 'Reizen' },
];


const ButtonGroup = ({ options, value, onChange, error }) => (
  <div className="flex gap-2">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
          value === option.value
            ? 'bg-rose-500 text-white shadow-sm'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);


const HobbyCategory = ({ category, hobbies, selectedHobbies, onToggle }) => (
  <div className="mb-6">
    <h3 className="text-base font-medium text-gray-900 mb-3">{category}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {hobbies.map((hobby) => (
        <button
          key={hobby.name}
          onClick={() => onToggle(hobby)}
          className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
            selectedHobbies.includes(hobby.name)
              ? 'bg-rose-500 text-white border-rose-600 shadow-sm transform scale-[1.02]'
              : 'border-gray-200 hover:bg-rose-50 hover:border-rose-300'
          }`}
          aria-pressed={selectedHobbies.includes(hobby.name)}
        >
          <span role="img" aria-label={hobby.name} className="text-xl">
            {hobby.icon}
          </span>
          <span className="text-sm font-medium truncate">{hobby.name}</span>
        </button>
      ))}
    </div>
  </div>
);

const HobbiesModal = ({ showModal, setShowModal, selectedHobbies, setSelectedHobbies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    if (showModal) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const categories = ['all', ...new Set(availableHobbies.map(h => h.category))];

  const filteredHobbies = availableHobbies.filter(hobby =>
    hobby.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeCategory === 'all' || hobby.category === activeCategory)
  );

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-4 border-b flex items-center justify-between bg-gray-50 rounded-t-2xl">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 pl-4">
            Selecteer Hobby's
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-4 border-b bg-white">
          <div className="relative mb-4">
            <input
              type="search"
              placeholder="Zoek hobby's..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-gray-50"
              aria-label="Zoek hobby's"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-rose-500 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Alle' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {filteredHobbies.length > 0 ? (
            Object.entries(
              filteredHobbies.reduce((acc, hobby) => {
                const category = activeCategory === 'all' ? hobby.category : activeCategory;
                if (!acc[category]) acc[category] = [];
                acc[category].push(hobby);
                return acc;
              }, {})
            ).map(([category, hobbies]) => (
              <HobbyCategory
                key={category}
                category={category}
                hobbies={hobbies}
                selectedHobbies={selectedHobbies}
                onToggle={(hobby) => {
                  setSelectedHobbies(prev =>
                    prev.includes(hobby.name)
                      ? prev.filter(h => h !== hobby.name)
                      : [...prev, hobby.name]
                  );
                }}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-lg">Geen hobby's gevonden voor "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterForm = () => {
  const [formState, setFormState] = useState({
    restriction: '',
    interest: '',
    physical: '',
    distance: '5',
    minAge: '18',
    maxAge: '35'
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const interestOptions = [
    { value: 'man', label: 'Man 🤷‍♂️' },
    { value: 'vrouw', label: 'Vrouw 🤷‍♀️' },
    { value: 'geen-voorkeur', label: 'x 🤷‍♂️/🤷‍♀️' },
  ];

  const physicalOptions = [
    { value: 'ja', label: 'Ja ✔️' },
    { value: 'nee', label: 'Nee ❌' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formState.interest) newErrors.interest = 'Selecteer een interesse';
    if (!formState.physical) newErrors.physical = 'Selecteer een optie';
    if (!formState.distance) newErrors.distance = 'Voer een afstand in';
    if (!formState.minAge) newErrors.age = 'Selecteer een minimum leeftijd';
    if (!formState.maxAge) newErrors.age = 'Selecteer een maximum leeftijd';
    if (selectedHobbies.length === 0) newErrors.hobbies = 'Selecteer ten minste één hobby';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = { ...formState, hobbies: selectedHobbies };
      setSubmittedData(dataToSubmit);
      console.log('Form submitted:', dataToSubmit);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getHobbyIcon = (hobbyName) => {
    const hobby = availableHobbies.find(h => h.name === hobbyName);
    return hobby ? hobby.icon : '🎯';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Filter Voorkeuren</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-2xl border border-gray-100">
        <div className="space-y-2">
          <label htmlFor="restriction" className="block text-sm font-medium text-gray-700">
            Beperkingen
          </label>
          <input
            type="text"
            id="restriction"
            name="restriction"
            value={formState.restriction}
            onChange={handleInputChange}
            className="w-full h-12 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 bg-gray-50 focus:bg-white transition duration-150 ease-in-out"
            placeholder="Voer eventuele beperkingen in..."
          />
          {errors.restriction && <div className="text-red-500 text-sm mt-1">{errors.restriction}</div>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Leeftijdsvoorkeur
          </label>
          <AgeRangeControl
            minValue={formState.minAge}
            maxValue={formState.maxAge}
            onChangeMin={(value) => {
              setFormState(prev => ({ ...prev, minAge: value }));
              if (errors.age) setErrors(prev => ({ ...prev, age: '' }));
            }}
            onChangeMax={(value) => {
              setFormState(prev => ({ ...prev, maxAge: value }));
              if (errors.age) setErrors(prev => ({ ...prev, age: '' }));
            }}
          />
          {errors.age && <div className="text-red-500 text-sm">{errors.age}</div>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Waar heb je interesse in?
          </label>
          <ButtonGroup
            options={interestOptions}
            value={formState.interest}
            onChange={(value) => {
              setFormState(prev => ({ ...prev, interest: value }));
              if (errors.interest) setErrors(prev => ({ ...prev, interest: '' }));
            }}
          />
          {errors.interest && <div className="text-red-500 text-sm">{errors.interest}</div>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Zou je het fijn vinden om intiem 💏 te zijn met je lief?
          </label>
          <ButtonGroup
            options={physicalOptions}
            value={formState.physical}
            onChange={(value) => {
              setFormState(prev => ({ ...prev, physical: value }));
              if (errors.physical) setErrors(prev => ({ ...prev, physical: '' }));
            }}
          />
          {errors.physical && <div className="text-red-500 text-sm">{errors.physical}</div>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Maximale afstand
          </label>
          <DistanceControl
            value={formState.distance}
            onChange={(value) => {
              setFormState(prev => ({ ...prev, distance: value }));
              if (errors.distance) setErrors(prev => ({ ...prev, distance: '' }));
            }}
          />
          {errors.distance && <div className="text-red-500 text-sm">{errors.distance}</div>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Geselecteerde Hobby's
          </label>
          <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-gray-50 rounded-xl border border-gray-200">
            {selectedHobbies.map((hobby) => (
              <div 
                key={hobby} 
                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
              >
                <span>{getHobbyIcon(hobby)}</span>
                <span className="text-sm font-medium">{hobby}</span>
                <button
                  type="button"
                  onClick={() => setSelectedHobbies(prev => prev.filter(h => h !== hobby))}
                  className="ml-1 text-gray-400 hover:text-red-500"
                  aria-label={`Verwijder ${hobby}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.hobbies && <div className="text-red-500 text-sm">{errors.hobbies}</div>}
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full border border-gray-300 rounded-xl p-3 text-left hover:bg-gray-50 focus:ring-2 focus:ring-rose-500"
        >
          {selectedHobbies.length === 0 ? 'Selecteer hobby\'s...' : `${selectedHobbies.length} hobby's geselecteerd`}
        </button>

        <button 
          type="submit" 
          className="w-full bg-rose-500 text-white p-3 rounded-xl font-medium hover:bg-rose-600 transition-colors"
        >
          Verzenden
        </button>
        
        {submittedData && (
          <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center animate-fade-in">
            <h2 className="text-lg font-semibold">Gegevens Verzonden!</h2>
            <p><strong>Beperkingen:</strong> {submittedData.restriction}</p>
            <p><strong>Leeftijdsvoorkeur:</strong> {submittedData.minAge} - {submittedData.maxAge} jaar</p>
            <p><strong>Interesse:</strong> {submittedData.interest}</p>
            <p><strong>Intiem:</strong> {submittedData.physical}</p>
            <p><strong>Maximale Afstand:</strong> {submittedData.distance}</p>
            <p><strong>Geselecteerde Hobby's:</strong> {submittedData.hobbies.join(', ')}</p>
          </div>
        )}
      </form>
      
      <HobbiesModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedHobbies={selectedHobbies}
        setSelectedHobbies={setSelectedHobbies}
      />
    </div>
  );
};

export default FilterForm;