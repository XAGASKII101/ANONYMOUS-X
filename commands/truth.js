const fetch = require('node-fetch');

async function truthCommand(sock, chatId, message) {
    try {
        const shizokeys = 'knightbot';
        const res = await fetch(`https://api.shizo.top/api/quote/truth?apikey=${shizokeys}`);
        
        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }
        
        const json = await res.json();
        const truthMessage = json.result || "Here's a truth: Be honest about your feelings and intentions.";

        // Send the truth message
        await sock.sendMessage(chatId, { text: `🤔 *TRUTH*\n\n${truthMessage}` }, { quoted: message });
    } catch (error) {
        console.error('Error in truth command:', error);
        // Fallback truth message
        const fallbackTruths = [
            "What's the most embarrassing thing you've ever done?",
            "Have you ever lied to your best friend?",
            "What's your biggest fear?",
            "What's the worst thing you've ever said about someone?",
            "Have you ever cheated on a test?"
        ];
        const randomTruth = fallbackTruths[Math.floor(Math.random() * fallbackTruths.length)];
        await sock.sendMessage(chatId, { text: `🤔 *TRUTH*\n\n${randomTruth}` }, { quoted: message });
    }
}

module.exports = { truthCommand };
