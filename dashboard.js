document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const token = localStorage.getItem('classmind_token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Verify Real Session
    if (typeof window.supabaseClient === 'undefined' || !window.supabaseClient) {
        console.error("Supabase client not found.");
        return;
    }
    const { data: { session }, error: sessionError } = await window.supabaseClient.auth.getSession();
    if (!session || sessionError) {
        localStorage.removeItem('classmind_token');
        window.location.href = '/login.html';
        return;
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await window.supabaseClient.auth.signOut();
        localStorage.removeItem('classmind_token');
        window.location.href = '/login.html';
    });

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
