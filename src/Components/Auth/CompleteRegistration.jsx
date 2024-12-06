import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/helper/supabaseClient';
import { useAuth } from '../../hooks/AuthContext';
import { User, Calendar, Camera } from 'lucide-react';


const CompleteProfile = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log(user);

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
      if (image) {
        const { error: uploadError } = await supabase.storage
          .from('pictures')
          .upload(`${user.id}/profielAfbeelding/${image.name}`, image);

        if (uploadError) throw uploadError;
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: name,
          birthday: birthdate,
          gender: gender
        })
        .eq('id', user.id);

      if (error) throw error;

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          subscription: 'BASIS',
          end_date: endDate,
          active: false
        })
      if (subscriptionError){
        console.log("starting free trial failed", subscriptionError);
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
    <div className="min-h-screen flex flex-col bg-rose-50">
      <div className="min-h-screencontainer mx-auto px-4 flex items-center justify-center flex-grow mt-16 mb-4 md:mt-0 md:mb-0 ">
        <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-rose-700 text-white text-center py-6">
            <h1 className="text-3xl font-bold">Voltooi je profiel</h1>
            <p className="text-sm mt-2 opacity-80">U bent er bijna! Nog enkele stappen.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Input */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Naam
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-3 px-12 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                  placeholder="Voer je naam in"
                  required
                />
              </div>
            </div>

            {/* Birthdate Input */}
            <div className="relative">
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                Geboortedatum
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  id="birthday"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full py-3 px-12 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                  required
                />
              </div>
            </div>

            {/* Gender Input */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
                required
              >
                <option value="">Selecteer je gender</option>
                <option value="man">Man</option>
                <option value="vrouw">Vrouw</option>
                <option value="anders">Anders</option>
              </select>
            </div>

            {/* Profile Picture Input */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Profielfoto (optioneel)
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full py-3 px-12 bg-gray-50 rounded-lg border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f43f5e]/10 file:text-[#f43f5e] hover:file:bg-[#f43f5e]/20"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#f43f5e] text-white rounded-lg hover:bg-[#be123c] transition-transform transform hover:scale-[1.02] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
              disabled={loading}
            >
              {loading ? 'Bezig met opslaan...' : 'Profiel Voltooien'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;