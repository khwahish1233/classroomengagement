document.addEventListener('DOMContentLoaded', async () => {
    // Auth check removed - teachers enter directly    // Navigation Logic
    const navEngagement = document.getElementById('navEngagement');
    const navAnalytics = document.getElementById('navAnalytics');
    const engagementView = document.getElementById('engagementView');
    const analyticsView = document.getElementById('analyticsView');

    navEngagement.addEventListener('click', (e) => {
        e.preventDefault();
        navEngagement.classList.add('active');
        navAnalytics.classList.remove('active');
        engagementView.classList.remove('hidden');
        analyticsView.classList.add('hidden');
    });

    navAnalytics.addEventListener('click', (e) => {
        e.preventDefault();
        navAnalytics.classList.add('active');
        navEngagement.classList.remove('active');
        analyticsView.classList.remove('hidden');
        engagementView.classList.add('hidden');
        fetchAnalytics();
    });

    document.getElementById('refreshAnalytics').addEventListener('click', fetchAnalytics);

    async function fetchAnalytics() {
        const analyticsList = document.getElementById('analyticsList');
        analyticsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Loading data from Supabase...</p>';

        try {
            const { data, error } = await window.supabaseClient
                .from('engagements')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;

            if (data.length === 0) {
                analyticsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No history found yet.</p>';
                return;
            }

            analyticsList.innerHTML = data.map(item => `
                <div class="analytics-row">
                    <span class="type-tag ${item.type}">${item.type.toUpperCase()}</span>
                    <span class="content-text">${item.content}</span>
                    <span class="date-text">${new Date(item.timestamp).toLocaleString()}</span>
                </div>
            `).join('');
        } catch (e) {
            console.error(e);
            analyticsList.innerHTML = '<p style="text-align: center; color: var(--accent); padding: 2rem;">Error loading data. Check console.</p>';
        }
    }    // Initialize Supabase Client
    if (typeof window.supabaseClient === 'undefined' || !window.supabaseClient) {
        console.warn("Supabase client not found. DB features may be limited.");
    }



    // Populate Mock Students (UI Only)
    const studentList = document.getElementById('studentList');
    const students = [
        { name: "Alex Johnson", status: "active" },
        { name: "Maria Garcia", status: "active" },
        { name: "James Smith", status: "idle" },
        { name: "Sophia Lee", status: "active" },
        { name: "Liam Brown", status: "idle" }
    ];

    studentList.innerHTML = students.map(s => `
        <div class="student-card">
            <div class="student-info">
                <div class="avatar" style="width: 32px; height: 32px; font-size: 0.8rem;">
                    ${s.name.charAt(0)}
                </div>
                <span>${s.name}</span>
            </div>
            <div class="status-dot ${s.status === 'idle' ? 'idle' : ''}" title="${s.status}"></div>
        </div>
    `).join('');

    // Launch Poll
    const launchPollBtn = document.getElementById('launchPollBtn');
    launchPollBtn.addEventListener('click', async () => {
        const question = document.getElementById('pollQuestion').value;
        const optA = document.getElementById('optionA').value;
        const optB = document.getElementById('optionB').value;
        
        if (!question) return alert("Please enter a question!");

        launchPollBtn.innerText = "Launching...";
        
        try {
            const { error } = await window.supabaseClient.from('engagements').insert([
                { type: 'poll', content: question, options: { a: optA, b: optB }, timestamp: new Date() }
            ]);
            if (error) throw error;

            launchPollBtn.innerText = "🚀 Launch Live Poll";
            document.getElementById('pollQuestion').value = '';
            document.getElementById('optionA').value = '';
            document.getElementById('optionB').value = '';
            alert("Poll launched successfully and saved to Supabase!");
        } catch(e) { 
            console.error(e);
            alert("Error saving to Supabase. Check console.");
            launchPollBtn.innerText = "🚀 Launch Live Poll";
        }
    });

    // Broadcast
    const broadcastBtn = document.getElementById('broadcastBtn');
    broadcastBtn.addEventListener('click', async () => {
        const msg = document.getElementById('announcementMsg').value;
        if (!msg) return alert("Enter a message!");

        broadcastBtn.innerText = "Sending...";

        try {
            const { error } = await window.supabaseClient.from('engagements').insert([
                { type: 'announcement', content: msg, timestamp: new Date() }
            ]);
            if (error) throw error;

            broadcastBtn.innerText = "📢 Send Announcement";
            document.getElementById('announcementMsg').value = '';
            alert("Announcement broadcasted and saved to Supabase!");
        } catch(e) { 
            console.error(e);
            alert("Error saving to Supabase. Check console.");
            broadcastBtn.innerText = "📢 Send Announcement";
        }
    });
});
