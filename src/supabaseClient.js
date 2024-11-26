import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables: REACT_APP_SUPABASE_URL and REACT_APP_SERVICE_ROLE");
  }

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
