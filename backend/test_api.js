(async () => {
    try {
        console.log("Connecting to local chatbot API...");
        const res = await fetch('http://localhost:5000/api/chatbot/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: 'test_mentor_123', 
                message: 'Hello! I am getting a TypeError: Cannot read properties of undefined (reading "length"). Can you give me the exact code to fix it?' 
            })
        });
        
        const data = await res.json();
        
        if (data.success) {
            console.log("\n✅ MENTOR AI RESPONSE:\n----------------------\n");
            console.log(data.reply);
            console.log("\n----------------------\n");
        } else {
            console.error("❌ API ERROR:", data.message);
        }
    } catch (e) {
        console.error("❌ CONNECTION ERROR:", e.message);
        console.log("Ensure the backend server is running on port 5000.");
    }
})();
