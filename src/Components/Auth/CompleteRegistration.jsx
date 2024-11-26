import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import butterflyImage from '../../Assets/Butterfly.png'; // Reuse the butterfly image for consistency
import { useAuth } from '../../hooks/AuthContext';


const CompleteProfile = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle image input change  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // If an image is selected, upload it to Supabase storage
      if (image) {
        const { data, error: uploadError } = await supabase.storage
          .from('user-images')
          .upload(`profiles/${Date.now()}_${image.name}`, image);

        if (uploadError) throw uploadError;
      }


      // Insert the user's profile data into the 'users' table
      const { error } = await supabase
        .from('users')
        .update({
          name: name,
          birthday: birthdate,
          //profilepictureBASE64: imageUrl
        })
        .eq('id', user.id);

      if (error) throw error;

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);



      // Insert the user's profile data into the 'subscriptions' table and start free trial
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



      navigate('/');  // Navigate to the home page after successful profile creation
    } catch (err) {
      setError('Er ging iets mis. Probeer het opnieuw.');
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#fff1f2] to-[#ffe4e6]">
      {/* Background with butterfly image */}
      <div
        className="flex items-center justify-center flex-1 relative bg-cover bg-center"
        style={{
          backgroundColor: 'bg-rose-100',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Profile Completion Form */}
        <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full z-10 mt-18">
          <h1 className="text-3xl font-bold text-center text-[#f43f5e] mb-6">Voltooi je profiel</h1>
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
                className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
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
                id="birthday"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full py-3 px-12 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fda4af]"
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
                onChange={handleImageChange} // Use the handler
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2024 V(l)inder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CompleteProfile;
