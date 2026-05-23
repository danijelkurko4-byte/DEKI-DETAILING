/**
 * Supabase — upiši URL i anon key iz: Supabase → Project Settings → API
 * Admin nalog: Authentication → Users (email + lozinka za admin.html)
 */
const SUPABASE_CONFIG = {
  url: 'https://appwicoxfoegjcikxbpe.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwcHdpY294Zm9lZ2pjaWt4YnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTYzODQsImV4cCI6MjA5NDQ5MjM4NH0.pvf9dnFji-VZV4tCZyIVaAy_oO2IqqQCL8kGFZG08Lg',
};

function isSupabaseConfigured() {
  const url = String(SUPABASE_CONFIG.url || '').trim();
  const key = String(SUPABASE_CONFIG.anonKey || '').trim();
  return url.length > 10 && key.length > 20 && url.indexOf('supabase.co') !== -1;
}
