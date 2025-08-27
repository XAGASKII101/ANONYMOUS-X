
const PhoneNumber = require('awesome-phonenumber');

async function whoamiCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const senderNumber = senderId.replace('@s.whatsapp.net', '');
        
        // Get group metadata to check saved names
        if (chatId.endsWith('@g.us')) {
            const groupMetadata = await sock.groupMetadata(chatId);
            const participant = groupMetadata.participants.find(p => p.id === senderId);
            
            if (participant && participant.notify) {
                await sock.sendMessage(chatId, {
                    text: `📱 Your number is saved as: *${participant.notify}*`
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    text: `📱 Your number (${senderNumber}) is not saved in contacts`
                }, { quoted: message });
            }
        } else {
            // In private chat, check if bot has the contact saved
            const contactName = sock.getName ? await sock.getName(senderId) : null;
            if (contactName && contactName !== senderNumber) {
                await sock.sendMessage(chatId, {
                    text: `📱 Your number is saved as: *${contactName}*`
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    text: `📱 Your number (${senderNumber}) is not saved in contacts`
                }, { quoted: message });
            }
        }
    } catch (error) {
        console.error('Error in whoami command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error checking contact info'
        }, { quoted: message });
    }
}

module.exports = whoamiCommand;
