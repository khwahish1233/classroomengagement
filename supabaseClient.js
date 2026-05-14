// Please provide your Supabase URL and Anon Key below
window.supabaseUrl = 'https://pjgcnldedkfrpsrijwqq.supabase.co';
window.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZ2NubGRlZGtmcnBzcmlqd3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTkwMjgsImV4cCI6MjA5NDMzNTAyOH0.2VgyrQPNDXuXUCGAkzmgXtKFBKGXBSHPxyVFU87P5t0';

// Initialize the real Supabase Client and attach to window for global access
if (window.supabase) {
    window.supabaseClient = window.supabase.createClient(window.supabaseUrl, window.supabaseKey);
} else {
    console.error("Supabase SDK not loaded! Check your internet connection or script tag.");
}
