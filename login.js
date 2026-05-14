document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (localStorage.getItem('classmind_token')) {
        window.location.href = '/';
    }

    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('error-msg');
    const loginBtn = document.getElementById('loginBtn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsg.classList.remove('visible');
        loginBtn.innerText = 'Authenticating...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Real Supabase Mode ONLY
            if (!window.supabaseClient) {
                throw new Error("Supabase client not initialized. Please check your credentials in supabaseClient.js");
            }
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email, password
            });

            if (error) throw error;
            
            if (data.session) {
                localStorage.setItem('classmind_token', data.session.access_token);
                window.location.href = '/';
            }
        } catch (error) {
            errorMsg.innerText = error.message || "Failed to connect to Supabase. Check your credentials.";
            errorMsg.classList.add('visible');
            loginBtn.innerText = 'Sign In Securely';
        }
    });
});
