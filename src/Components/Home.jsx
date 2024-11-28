import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Star } from 'lucide-react';
import { supabase } from '../lib/helper/supabaseClient';
import { useAuth } from '../hooks/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const [isPausedModalOpen, setIsPausedModalOpen] = useState(false);
  const { user, logout, role } = useAuth();
  const email = user?.email;
  const loggedIn = !!user;

  useEffect(() => {
    if (role === 'STAFF_MEMBER') {
      navigate('/settingsMentor');
    }
  }, [navigate, role]);

  const handleButtonClick = useCallback(() => {
    if (loggedIn) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  }, [loggedIn, logout, navigate]);

  const handleGoToFeed = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('status')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching account status:', error);
        return;
      }

      if (data.status === 'PAUSED') {
        setIsPausedModalOpen(true);
      } else {
        navigate('/feed');
      }
    } catch (err) {
      console.error('Error checking account status:', err);
    }
  }, [navigate, email]);

  const handleUnpauseAccount = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'ACTIVE' })
        .eq('email', email);

      if (error) {
        console.error('Error updating account status:', error);
        return;
      }

      setIsPausedModalOpen(false);
      navigate('/feed');
    } catch (err) {
      console.error('Error updating account status:', err);
    }
  }, [navigate, email]);

  return (
    <div className="bg-gradient-to-br from-rose-50 to-rose-100 min-h-screen">
      {/* Paused Account Modal */}
      {isPausedModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-3xl font-bold text-rose-600 mb-4">Account Gepauzeerd</h2>
            <p className="text-gray-600 mb-6">Je account is momenteel gepauzeerd. Je kunt de feed niet openen totdat het wordt geactiveerd.</p>
            <div className="flex space-x-4">
              <button
                onClick={handleUnpauseAccount}
                className="flex-1 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Account Heractiveren
              </button>
              <button
                onClick={() => setIsPausedModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Sluiten
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-8xl font-extrabold text-rose-900 mt-16 mb-6 font-dynapuff"
          >
            V(l)inder
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-700 max-w-2xl mx-auto mb-10"
          >
            Ontdek verbindingen die je leven verrijken - of het nu gaat om liefde, vriendschap of avontuur!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-center space-x-4"
          >
            <button
              onClick={handleGoToFeed}
              className="bg-rose-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-rose-700 transition-colors shadow-lg"
            >
              Ontdek Matches
            </button>
            <button
              onClick={handleButtonClick}
              className="bg-white text-rose-600 px-8 py-3 rounded-full text-lg font-semibold border border-rose-600 hover:bg-rose-50 transition-colors shadow-md"
            >
              {loggedIn ? 'Uitloggen' : 'Inloggen'}
            </button>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Waarom V(l)inder?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Intelligent Matchen',
                description: 'Ons geavanceerde algoritme vindt de meest geschikte connecties op basis van je voorkeuren en persoonlijkheid.',
                color: 'text-rose-600'
              },
              {
                icon: Shield,
                title: 'Privacy & Veiligheid',
                description: 'Jouw veiligheid staat voorop. Strenge verificatie en geavanceerde privacycontroles beschermen je profiel.',
                color: 'text-emerald-600'
              },
              {
                icon: Users,
                title: 'Diverse Ontmoetingen',
                description: 'Of je nu op zoek bent naar romantiek, vriendschap of professionele netwerken - V(l)inder heeft het allemaal.',
                color: 'text-indigo-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className={`mb-6 flex items-center justify-center ${feature.color}`}>
                  <feature.icon size={64} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Verhalen van Onze Community</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "V(l)inder heeft mijn leven compleet veranderd. Ik heb niet alleen mijn soulmate gevonden, maar ook mezelf herontdekt!",
                name: "Sophie R.",
                location: "Amsterdam"
              },
              {
                quote: "Als introvert vond ik het altijd lastig om nieuwe mensen te ontmoeten. V(l)inder maakte dat proces zo natuurlijk en leuk!",
                name: "Mark T.",
                location: "Rotterdam"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3, duration: 0.6 }}
                className="bg-white p-8 rounded-2xl shadow-lg relative"
              >
                <Star className="absolute top-4 left-4 text-yellow-400" size={32} />
                <p className="text-xl italic text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-bold text-rose-600">{testimonial.name}</p>
                    <p className="text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-rose-500 mb-2">V(l)inder</h3>
            <p className="text-gray-400">Verbindingen die je leven verrijken</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-rose-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-rose-500 transition-colors">Gebruiksvoorwaarden</a>
            <a href="#" className="text-gray-300 hover:text-rose-500 transition-colors">Contact</a>
          </div>
          <div className="mt-4 md:mt-0 text-gray-500">
            © 2024 V(l)inder. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;