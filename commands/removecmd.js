
async function removeCmdCommand(sock, chatId, message) {
    try {
        // Check if it's owner
        if (!message.key.fromMe) {
            await sock.sendMessage(chatId, {
                text: '❌ Only bot owner can use this command!'
            });
            return;
        }

        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            await sock.sendMessage(chatId, {
                text: '❌ Please reply to a command with image to remove it'
            });
            return;
        }

        // Check if quoted message has image
        if (quotedMessage.imageMessage) {
            // Get the quoted message key
            const quotedKey = message.message.extendedTextMessage.contextInfo.stanzaId;
            const quotedRemoteJid = message.message.extendedTextMessage.contextInfo.remoteJid || chatId;
            
            try {
                // Delete the quoted message
                await sock.sendMessage(chatId, {
                    delete: {
                        remoteJid: quotedRemoteJid,
                        fromMe: false,
                        id: quotedKey,
                        participant: message.message.extendedTextMessage.contextInfo.participant
                    }
                });
                
                await sock.sendMessage(chatId, {
                    text: '✅ Command image removed'
                });
            } catch (deleteError) {
                await sock.sendMessage(chatId, {
                    text: '❌ Failed to remove command image'
                });
            }
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Quoted message does not contain an image'
            });
        }
    } catch (error) {
        console.error('Error in removecmd command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error removing command image'
        });
    }
}

module.exports = removeCmdCommand;
