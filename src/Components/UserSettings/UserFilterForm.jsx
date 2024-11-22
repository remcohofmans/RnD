import React, { useState, useEffect } from 'react';
import DistanceControl from '../Filter/DistanceControl';
import AgeRangeControl from '../Filter/AgeRangeControl';
import { supabase } from '../../supabaseClient';
import { availableHobbies, ButtonGroup, HobbiesModal } from '../Filter/AvailableHobbiesPage';

const FilterForm = () => {
  const [formState, setFormState] = useState({
    interest: '',
    distance: '5',
    minAge: '18',
    maxAge: '35',
  });
  
  const [showModal, setShowModal] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState([]); 
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [userId, setUserId] = useState(null);

  const interestOptions = [
    { value: 'man', label: 'Man 🤷‍♂️' },
    { value: 'vrouw', label: 'Vrouw 🤷‍♀️' },
    { value: 'geen-voorkeur', label: 'x 🤷‍♂️/🤷‍♀️' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        console.log("Session user ID:", session.user.id);
      }
    };
    fetchUserData();
  }, []);

  const fetchData = async () => {
    if (!userId) return;
  
    console.log('Fetching preferences for user:', userId);
  
    try {
      const { data, error } = await supabase
        .from('userpreferences')
        .select('*')
        .eq('id', userId)
        .single();
  
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Fetched data:', data);
        setFormState({
          interest: data.interest || '',
          distance: (data.distance || 5).toString(),
          minAge: (data.min_age || 18).toString(),
          maxAge: (data.max_age || 35).toString(),
        });
  
        // Parse the hobbies from the stringified JSON array to an actual array
        const hobbies = data.hobbies ? JSON.parse(data.hobbies) : [];
        setSelectedHobbies(hobbies);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [userId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formState.interest) newErrors.interest = 'Selecteer een interesse';
    if (!formState.distance) newErrors.distance = 'Voer een afstand in';
    if (!formState.minAge) newErrors.age = 'Selecteer een minimum leeftijd';
    if (!formState.maxAge) newErrors.age = 'Selecteer een maximum leeftijd';
    if (selectedHobbies.length === 0) newErrors.hobbies = 'Selecteer ten minste één hobby';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        id: userId,
        interest: formState.interest,
        min_age: parseInt(formState.minAge),
        max_age: parseInt(formState.maxAge),
        distance: parseInt(formState.distance),
        hobbies: selectedHobbies,
      };

      try {
        const { data, error } = await supabase
          .from('userpreferences')
          .select('id')
          .eq('id', userId)
          .single();

        if (data) {
          const { data: updateData, error: updateError } = await supabase
            .from('userpreferences')
            .update(dataToSubmit)
            .eq('id', userId);

          if (updateError) {
            console.error('Error updating data:', updateError);
          } else {
            setSubmittedData(dataToSubmit);
            console.log('Form updated:', dataToSubmit);
          }
        } else {
          const { data: insertData, error: insertError } = await supabase
            .from('userpreferences')
            .insert([dataToSubmit]);

          if (insertError) {
            console.error('Error inserting data:', insertError);
          } else {
            setSubmittedData(dataToSubmit);
            console.log('Form submitted:', dataToSubmit);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRemoveHobby = (hobby) => {
    setSelectedHobbies((prev) => prev.filter((h) => h !== hobby));
  };

  const handleAddHobby = (hobby) => {
    setSelectedHobbies((prev) => [...prev, hobby]);
  };

  const getHobbyIcon = (hobbyName) => {
    const hobby = availableHobbies.find((h) => h.name === hobbyName);
    return hobby ? hobby.icon : '🎯';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Persoonlijke Interesses</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 shadow-lg rounded-2xl border border-gray-100"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Waar heb je interesse in?
          </label>
          <ButtonGroup
            options={interestOptions}
            value={formState.interest}
            onChange={(value) => {
              setFormState((prev) => ({ ...prev, interest: value }));
              if (errors.interest) setErrors((prev) => ({ ...prev, interest: '' }));
            }}
          />
          {errors.interest && <div className="text-red-500 text-sm">{errors.interest}</div>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Welke leeftijd voorkeur heb je voor je toekomstige liefde?</label>
          <AgeRangeControl
            minValue={formState.minAge}
            maxValue={formState.maxAge}
            onChangeMin={(value) => {
              setFormState((prev) => ({ ...prev, minAge: value }));
              if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
            }}
            onChangeMax={(value) => {
              setFormState((prev) => ({ ...prev, maxAge: value }));
              if (errors.age) setErrors((prev) => ({ ...prev, age: '' }));
            }}
          />
          {errors.age && <div className="text-red-500 text-sm">{errors.age}</div>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Wat is de maximale afstand die je wil afleggen om je liefde te ontmoeten?</label>
          <DistanceControl
            value={formState.distance}
            onChange={(value) => {
              setFormState((prev) => ({ ...prev, distance: value }));
              if (errors.distance) setErrors((prev) => ({ ...prev, distance: '' }));
            }}
          />
          {errors.distance && <div className="text-red-500 text-sm">{errors.distance}</div>}
        </div>


        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Jouw hobby's</label>
          <div className="flex flex-wrap gap-2">
            {selectedHobbies.length > 0 ? (
              selectedHobbies.map((hobby) => (
                <div key={hobby} className="flex items-center bg-rose-100 text-rose-500 text-sm py-1 px-3 rounded-full">
                  {getHobbyIcon(hobby)} {hobby}
                  <button
                    type="button"
                    onClick={() => handleRemoveHobby(hobby)}
                    className="ml-2 text-rose-500 hover:text-rose-700"
                  >
                    <span className="text-xl">x</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Je hebt nog geen hobby's geselecteerd</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-rose-500 hover:text-rose-700"
          >
            Voeg hobby toe
          </button>
          {errors.hobbies && <div className="text-red-500 text-sm">{errors.hobbies}</div>}
        </div>

        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold rounded-md text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Opslaan
        </button>
      </form>

      {showModal && (
        <HobbiesModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedHobbies={selectedHobbies}
          setSelectedHobbies={setSelectedHobbies}
        />
      )}

      {submittedData && (
        <div className="mt-8 p-4 bg-green-100 text-green-700 rounded-lg">
          Form data submitted successfully!
        </div>
      )}
    </div>
  );
};

export default FilterForm;
