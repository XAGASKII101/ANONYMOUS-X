const isAdmin = require('../lib/isAdmin');

async function addCommand(sock, chatId, message, number) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;

        // Check if it's a group
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in groups!'
            });
        }

        // Check if sender is admin
        const groupMetadata = await sock.groupMetadata(chatId);
        const senderIsAdmin = groupMetadata.participants.some(p => 
            p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin')
        );

        const botIsAdmin = groupMetadata.participants.some(p => 
            p.id === sock.user.id && (p.admin === 'admin' || p.admin === 'superadmin')
        );

        if (!botIsAdmin) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please make the bot an admin first!'
            });
        }

        if (!senderIsAdmin && !message.key.fromMe) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only group admins can use this command!'
            });
        }

        if (!number || !/^\d+$/.test(number)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a valid phone number!\n\n*Usage:* .add 1234567890'
            });
        }

        // Format the number
        const formattedNumber = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;

        try {
            const result = await sock.groupParticipantsUpdate(chatId, [formattedNumber], 'add');

            if (result[0]?.status === '200') {
                await sock.sendMessage(chatId, {
                    text: `✅ Successfully added +${number} to the group!`,
                    mentions: [formattedNumber]
                });
            } else if (result[0]?.status === '403') {
                await sock.sendMessage(chatId, {
                    text: `⚠️ Could not add +${number}.\nReason: User has privacy settings that prevent being added to groups.`
                });
            } else {
                await sock.sendMessage(chatId, {
                    text: `❌ Failed to add +${number}.\nThe number might be invalid or the user is already in the group.`
                });
            }
        } catch (error) {
            console.error('Error adding participant:', error);
            await sock.sendMessage(chatId, {
                text: `❌ Failed to add +${number}. Please check if the number is valid and registered on WhatsApp.`
            });
        }

    } catch (error) {
        console.error('Error in add command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ An error occurred while processing the add command.'
        });
    }
}

module.exports = addCommand;