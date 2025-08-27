const fetch = require('node-fetch');

async function dareCommand(sock, chatId, message) {
    try {
        const shizokeys = 'knightbot';
        const res = await fetch(`https://api.shizo.top/api/quote/dare?apikey=${shizokeys}`);
        
        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }
        
        const json = await res.json();
        const dareMessage = json.result || "I dare you to do 10 push-ups right now!";

        // Send the dare message
        await sock.sendMessage(chatId, { text: `😈 *DARE*\n\n${dareMessage}` }, { quoted: message });
    } catch (error) {
        console.error('Error in dare command:', error);
        // Fallback dare messages
        const fallbackDares = [
            "I dare you to do 10 push-ups right now!",
            "Send a funny selfie to the group!",
            "Call a random contact and say 'I love you'!",
            "Dance for 30 seconds without music!",
            "Text your crush right now!"
        ];
        const randomDare = fallbackDares[Math.floor(Math.random() * fallbackDares.length)];
        await sock.sendMessage(chatId, { text: `😈 *DARE*\n\n${randomDare}` }, { quoted: message });
    }
}

module.exports = { dareCommand };
