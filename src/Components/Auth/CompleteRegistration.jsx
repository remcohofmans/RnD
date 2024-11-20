import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const CompleteProfile = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Upload de afbeelding naar Supabase Storage (indien een afbeelding is geselecteerd)
      let imageUrl = null;
      if (image) {
        const { data, error: uploadError } = await supabase.storage
          .from('user-images') // Zorg ervoor dat de bucket 'user-images' bestaat in Supabase
          .upload(`profiles/${Date.now()}_${image.name}`, image);

        if (uploadError) {
          throw uploadError;
        }
        imageUrl = data.path;
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          name,
          birthdate,
          profile_image: imageUrl,
        });

      if (insertError) {
        throw insertError;
      }

      navigate('/');
    } catch (err) {
      setError('Er ging iets mis. Probeer het opnieuw.');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#be123c] mb-4">Voltooi je profiel</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Naam
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#fda4af] focus:border-[#e11d48]"
              placeholder="Voer je naam in"
              required
            />
          </div>

          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
              Geboortedatum
            </label>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#fda4af] focus:border-[#e11d48]"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Profielfoto (optioneel)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Bezig met opslaan...' : 'Voltooien'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
