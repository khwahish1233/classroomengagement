// Please provide your Supabase URL and Anon Key below
window.supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
window.supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize the real Supabase Client and attach to window for global access
if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(window.supabaseUrl, window.supabaseKey);
} else {
    console.error("Supabase SDK not loaded! Check your internet connection or script tag.");
}
