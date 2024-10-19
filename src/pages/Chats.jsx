import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const ChatsPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', user.id);

      if (matchesError) throw matchesError;

      const processedMatches = await Promise.all(matchesData.map(async match => {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email')
            .eq('id', match.matched_user_id)
            .single();

          if (userError) throw userError;

          return {
            ...match,
            matchedUserEmail: userData.email,
          };
        } catch (error) {
          console.error(`Error fetching user data for ${match.matched_user_id}:`, error);
          return {
            ...match,
            matchedUserEmail: 'unknown@example.com',
          };
        }
      }));

      setMatches(processedMatches);
    } catch (error) {
      console.error('Error in fetchMatches:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Matches</h1>
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">You don't have any matches yet.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((match) => (
            <li key={match.matched_user_id} className="bg-white shadow rounded-lg overflow-hidden">
              <Link to={`/chat/${match.matched_user_id}`} className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-200">
                <div>
                  <span className="text-lg font-semibold text-gray-700">Matched User ID: {match.matched_user_id}</span>
                  <p className="text-sm text-gray-500">Email: {match.matchedUserEmail}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatsPage;