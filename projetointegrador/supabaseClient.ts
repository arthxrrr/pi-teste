import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

export type { SupabaseClient };

// Expect these env vars set via app config or runtime
const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;
// URL fornecida pelo usuário (fallback padrão)
const SUPABASE_URL =
  (extra.EXPO_PUBLIC_SUPABASE_URL as string) ||
  (process.env.EXPO_PUBLIC_SUPABASE_URL as string) ||
  'https://dqcxhhmnlvrqgbzuimyt.supabase.co';
// Chave pode vir de EXPO_PUBLIC_SUPABASE_ANON_KEY (Expo) ou SUPABASE_KEY (fallback)
const SUPABASE_ANON_KEY =
  (extra.EXPO_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (process.env.SUPABASE_KEY as string);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Avoid crashing; warn for configuration
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing: EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

