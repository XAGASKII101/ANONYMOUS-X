
async function kickCommand(sock, chatId, senderId, mentionedJidList, message) {
    try {
        // Check if it's a group
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in groups!'
            });
        }

        // Delete the command message immediately
        await sock.sendMessage(chatId, { delete: message.key });

        // Check if bot is admin
        const groupMetadata = await sock.groupMetadata(chatId);
        const botIsAdmin = groupMetadata.participants.some(p => 
            p.id === sock.user.id && (p.admin === 'admin' || p.admin === 'superadmin')
        );

        if (!botIsAdmin) {
            return await sock.sendMessage(chatId, {
                text: '❌ *Bot Admin Required*\n\nPlease make the bot an admin to use kick command.'
            });
        }

        // Check if sender is admin
        const senderIsAdmin = groupMetadata.participants.some(p => 
            p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin')
        );

        if (!senderIsAdmin && !message.key.fromMe) {
            return await sock.sendMessage(chatId, {
                text: '❌ *Admin Permission Required*\n\nOnly group admins can use the kick command.'
            });
        }

        // Check if users are mentioned
        if (!mentionedJidList || mentionedJidList.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ *No Users Mentioned*\n\nPlease mention the users you want to kick.\n\n*Usage:* Reply to a message or mention users\n*Example:* .kick @user1 @user2'
            });
        }

        // Prevent kicking admins
        const adminsToKick = mentionedJidList.filter(jid => 
            groupMetadata.participants.some(p => 
                p.id === jid && (p.admin === 'admin' || p.admin === 'superadmin')
            )
        );

        if (adminsToKick.length > 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ *Cannot Kick Admins*\n\nAdministrators cannot be kicked from the group.'
            });
        }

        // Show processing message
        const processingMsg = await sock.sendMessage(chatId, {
            text: '⏳ *Processing kick request...*'
        });

        try {
            // Kick users
            const result = await sock.groupParticipantsUpdate(chatId, mentionedJidList, 'remove');
            
            let successCount = 0;
            let failCount = 0;
            const kickResults = [];

            for (let i = 0; i < result.length; i++) {
                const userResult = result[i];
                const userNumber = mentionedJidList[i].split('@')[0];
                
                if (userResult.status === '200') {
                    successCount++;
                    kickResults.push(`✅ +${userNumber} - Kicked successfully`);
                } else {
                    failCount++;
                    kickResults.push(`❌ +${userNumber} - Failed to kick`);
                }
            }

            // Delete processing message
            await sock.sendMessage(chatId, { delete: processingMsg.key });

            // Send results
            const resultMessage = `🦵 *KICK COMMAND RESULTS*\n\n` +
                               `📊 *Summary:*\n` +
                               `✅ Successful: ${successCount}\n` +
                               `❌ Failed: ${failCount}\n\n` +
                               `📋 *Details:*\n${kickResults.join('\n')}\n\n` +
                               `⏰ *Executed at:* ${new Date().toLocaleTimeString()}`;

            await sock.sendMessage(chatId, {
                text: resultMessage
            });

        } catch (error) {
            // Delete processing message
            await sock.sendMessage(chatId, { delete: processingMsg.key });
            
            console.error('Error kicking users:', error);
            await sock.sendMessage(chatId, {
                text: '❌ *Kick Command Failed*\n\nAn error occurred while trying to kick users. Please try again.'
            });
        }

    } catch (error) {
        console.error('Error in kick command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ *Command Error*\n\nFailed to process kick command.'
        });
    }
}

module.exports = kickCommand;
