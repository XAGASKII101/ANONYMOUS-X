
async function groupJidCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in groups!'
            });
            return;
        }

        const groupMetadata = await sock.groupMetadata(chatId);
        const groupName = groupMetadata.subject || 'Unknown Group';
        
        await sock.sendMessage(chatId, {
            text: `📋 *Group Information*\n\n` +
                  `📝 *Name:* ${groupName}\n` +
                  `🆔 *JID:* \`${chatId}\`\n` +
                  `👥 *Participants:* ${groupMetadata.participants.length}\n` +
                  `📅 *Created:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}`
        }, { quoted: message });

    } catch (error) {
        console.error('Error in groupjid command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to get group information!'
        }, { quoted: message });
    }
}

module.exports = groupJidCommand;
