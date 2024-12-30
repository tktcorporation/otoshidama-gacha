import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GachaResult = {
  id: string;
  created_at: string;
  player_name: string;
  amount: number;
  user_agent: string;
};

export async function saveGachaResult(amount: number, playerName: string) {
  const { data, error } = await supabase
    .from('gacha_results')
    .insert([
      {
        amount,
        player_name: playerName,
        user_agent: navigator.userAgent,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as GachaResult;
}

export async function getGachaResults() {
  const { data, error } = await supabase
    .from('gacha_results')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as GachaResult[];
}