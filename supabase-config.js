import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://swsshmhpadsqnneukauf.supabase.co";
const supabaseKey = "sb_publishable_fli4VzyBajWh0QXFjWyHww_JP-1JoVp";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);