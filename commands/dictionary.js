
const axios = require('axios');

async function dictionaryCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const word = text.split(' ').slice(1).join(' ').trim();

        if (!word) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a word to define!\n\n*Usage:* .define beautiful\n*Example:* .define computer'
            });
        }

        const processingMsg = await sock.sendMessage(chatId, {
            text: '🔍 *Searching dictionary...*'
        });

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = response.data[0];

            let definition = `📖 *DICTIONARY DEFINITION*\n\n`;
            definition += `🔤 *Word:* ${data.word}\n`;
            
            if (data.phonetic) {
                definition += `🔊 *Pronunciation:* ${data.phonetic}\n`;
            }

            definition += `\n📝 *Meanings:*\n`;

            for (let i = 0; i < Math.min(data.meanings.length, 3); i++) {
                const meaning = data.meanings[i];
                definition += `\n${i + 1}. *${meaning.partOfSpeech}*\n`;
                
                for (let j = 0; j < Math.min(meaning.definitions.length, 2); j++) {
                    const def = meaning.definitions[j];
                    definition += `   • ${def.definition}\n`;
                    
                    if (def.example) {
                        definition += `   💭 _Example: ${def.example}_\n`;
                    }
                }
            }

            if (data.meanings[0].synonyms && data.meanings[0].synonyms.length > 0) {
                definition += `\n🔄 *Synonyms:* ${data.meanings[0].synonyms.slice(0, 5).join(', ')}`;
            }

            await sock.sendMessage(chatId, { delete: processingMsg.key });
            await sock.sendMessage(chatId, { text: definition });

        } catch (error) {
            await sock.sendMessage(chatId, { delete: processingMsg.key });
            await sock.sendMessage(chatId, {
                text: `❌ *Word Not Found*\n\nCould not find definition for "${word}"\n\n💡 *Tips:*\n• Check spelling\n• Try a simpler form\n• Use common English words`
            });
        }

    } catch (error) {
        console.error('Error in dictionary command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ An error occurred while looking up the word.'
        });
    }
}

module.exports = dictionaryCommand;
