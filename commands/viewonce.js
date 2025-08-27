
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function viewOnceCommand(sock, chatId, message, args) {
    try {
        // Get the quoted message
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please reply to a view once message to decrypt it'
            });
        }

        // Check for view once message (both v1 and v2)
        const viewOnceMessage = quotedMessage.viewOnceMessage || quotedMessage.viewOnceMessageV2;
        if (!viewOnceMessage) {
            return await sock.sendMessage(chatId, {
                text: '❌ The replied message is not a view once message'
            });
        }

        // Delete the command message first
        await sock.sendMessage(chatId, { delete: message.key });

        // Get the actual media message
        const mediaMessage = viewOnceMessage.message;
        let mediaType, mediaData, extension, mimeType;

        if (mediaMessage.imageMessage) {
            mediaType = 'image';
            mediaData = mediaMessage.imageMessage;
            extension = 'jpg';
            mimeType = mediaData.mimetype || 'image/jpeg';
        } else if (mediaMessage.videoMessage) {
            mediaType = 'video';
            mediaData = mediaMessage.videoMessage;
            extension = 'mp4';
            mimeType = mediaData.mimetype || 'video/mp4';
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Unsupported view once media type'
            });
        }

        try {
            // Download the media
            const stream = await downloadContentFromMessage(mediaData, mediaType);
            let buffer = Buffer.alloc(0);
            
            const downloadTimeout = setTimeout(() => {
                throw new Error('Download timeout');
            }, 30000);

            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            clearTimeout(downloadTimeout);

            if (buffer.length === 0) {
                throw new Error('Empty buffer received');
            }

            // Save to temp folder for gallery access
            const fileName = `viewonce_${Date.now()}.${extension}`;
            const tempPath = path.join(__dirname, '../temp', fileName);
            
            // Ensure temp directory exists
            if (!fs.existsSync(path.dirname(tempPath))) {
                fs.mkdirSync(path.dirname(tempPath), { recursive: true });
            }
            
            fs.writeFileSync(tempPath, buffer);

            // Get bot owner number from settings
            const settings = require('../settings');
            const ownerNumber = settings.ownerNumber + '@s.whatsapp.net';
            
            // Get sender information
            const senderId = message.key.participant || message.key.remoteJid;
            const senderNumber = senderId.split('@')[0];

            // Create caption with sender info and timestamp
            const caption = `🔓 *VIEW ONCE DECRYPTED*\n\n` +
                          `👤 *From:* @${senderNumber}\n` +
                          `📅 *Date:* ${new Date().toLocaleDateString()}\n` +
                          `🕒 *Time:* ${new Date().toLocaleTimeString()}\n` +
                          `💾 *Saved to Gallery*\n\n` +
                          `✨ _Original view once media decrypted and saved_`;

            // Send to owner privately (yourself)
            if (mediaType === 'image') {
                await sock.sendMessage(ownerNumber, {
                    image: buffer,
                    caption: caption,
                    mentions: [senderId]
                });
            } else if (mediaType === 'video') {
                await sock.sendMessage(ownerNumber, {
                    video: buffer,
                    caption: caption,
                    mentions: [senderId]
                });
            }

            // Send confirmation to original chat
            await sock.sendMessage(chatId, {
                text: '✅ *View once media decrypted successfully*\n\n📱 Media has been saved to your device gallery and sent privately.'
            });

            // Clean up temp file after 5 minutes
            setTimeout(() => {
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
            }, 5 * 60 * 1000);

        } catch (downloadError) {
            console.error('Download error:', downloadError);
            
            await sock.sendMessage(chatId, {
                text: '❌ *Failed to decrypt view once media*\n\n' +
                      '🔍 Possible reasons:\n' +
                      '• Media has already been viewed\n' +
                      '• File is corrupted or too large\n' +
                      '• Network connection issues\n\n' +
                      '_Please try again with a different view once message_'
            });
        }

    } catch (error) {
        console.error('Error in viewonce command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ *Error processing view once message*\n\n' +
                  '💡 Make sure you replied to a valid view once message'
        });
    }
}

module.exports = viewOnceCommand;
