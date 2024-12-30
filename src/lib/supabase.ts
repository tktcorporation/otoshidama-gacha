import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveGachaResult(amount: number, playerName: string) {
  const { error } = await supabase
    .from('gacha_results')
    .insert([
      { 
        amount, 
        player_name: playerName,
        user_agent: navigator.userAgent
      }
    ]);

  if (error) {
    if (error.code === '23505') { // unique_violation
      throw new Error('すでにガチャを引いています');
    }
    throw error;
  }
}

export async function getGachaResult(playerName: string) {
  const { data, error } = await supabase
    .from('gacha_results')
    .select('amount')
    .eq('player_name', playerName)
    .limit(1)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST116') { // not found
      return null;
    }
    throw error;
  }

  return data?.amount ?? null;
}