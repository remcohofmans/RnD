import React, { useState, useEffect } from 'react';
export const availableHobbies = [
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


export const ButtonGroup = ({ options, value, onChange, error }) => (
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


export const HobbyCategory = ({ category, hobbies, selectedHobbies, onToggle }) => (
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

export const HobbiesModal = ({ showModal, setShowModal, selectedHobbies, setSelectedHobbies }) => {
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
             Hobby's
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

export default availableHobbies;