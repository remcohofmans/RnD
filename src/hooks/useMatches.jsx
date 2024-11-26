import { useState, useEffect } from 'react';
import { supabase} from '../lib/helper/supabaseClient'


export const useMatches = (userId) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) fetchMatches(userId);
  }, [userId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`id.eq.${user.id},matched_user_id.eq.${user.id}`);

      if (matchesError) throw matchesError;

      const userIds = new Set(matchesData.flatMap(match => [match.id, match.matched_user_id]));
      userIds.delete(user.id);

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, name')
        .in('id', Array.from(userIds));

      if (usersError) throw usersError;

      const userMap = Object.fromEntries(usersData.map(user => [user.id, user]));

      const processedMatches = matchesData.map(match => {
        const otherUserId = match.id === user.id ? match.matched_user_id : match.id;
        const otherUser = userMap[otherUserId];
        return {
          match_id: match.match_id,
          otherUserId: otherUserId,
          otherUserEmail: otherUser ? otherUser.email : 'Unknown',
          otherUserName: otherUser ? otherUser.name : 'name not found in users table'
        };
      });

      setMatches(processedMatches);
    } catch (error) {
      console.error('Error in fetchMatches:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { matches, loading, error };
};