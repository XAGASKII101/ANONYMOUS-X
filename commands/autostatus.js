
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../data/autoStatus.json');

function loadStatusConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading status config:', error);
    }
    return { enabled: false, timeframe: 30 };
}

function saveStatusConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Error saving status config:', error);
    }
}

async function autoStatusCommand(sock, chatId, message, args) {
    if (!message.key.fromMe) {
        return await sock.sendMessage(chatId, {
            text: '❌ *This command is only available for the owner!*'
        });
    }

    const config = loadStatusConfig();
    const match = args.join(' ').toLowerCase();

    if (!match) {
        const statusText = config.enabled ? '🟢 ENABLED' : '🔴 DISABLED';
        const timeframeText = config.enabled ? `⏱️ Viewing Delay: ${config.timeframe} seconds` : '';
        
        await sock.sendMessage(chatId, {
            text: `📱 *AUTO STATUS VIEWER*\n\n` +
                  `📊 *Current Status:* ${statusText}\n` +
                  `${timeframeText}\n\n` +
                  `🔧 *Available Commands:*\n` +
                  `• *.autostatus on* - Enable auto viewing\n` +
                  `• *.autostatus off* - Disable auto viewing\n` +
                  `• *.autostatus time <seconds>* - Set viewing delay\n` +
                  `• *.autostatus status* - Check current settings\n\n` +
                  `💡 *Recommended timeframe:* 15-120 seconds\n` +
                  `⚠️ *Note:* Lower values may appear suspicious`
        }, { quoted: message });
        return;
    }

    const [command, value] = match.split(' ');

    switch (command) {
        case 'on':
            if (config.enabled) {
                await sock.sendMessage(chatId, {
                    text: '⚠️ *Auto Status Already Enabled*\n\n' +
                          `⏱️ Current viewing delay: ${config.timeframe} seconds\n\n` +
                          `💡 Use *.autostatus time <seconds>* to adjust delay`
                }, { quoted: message });
                return;
            }
            
            config.enabled = true;
            saveStatusConfig(config);
            
            await sock.sendMessage(chatId, {
                text: '✅ *Auto Status Enabled Successfully*\n\n' +
                      `🔄 Bot will now automatically view status updates\n` +
                      `⏱️ Viewing delay: ${config.timeframe} seconds\n` +
                      `🎯 Smart timing to avoid detection\n\n` +
                      `💡 Use *.autostatus time <seconds>* to adjust delay\n` +
                      `⚙️ Use *.autostatus off* to disable`
            }, { quoted: message });
            break;

        case 'off':
            if (!config.enabled) {
                await sock.sendMessage(chatId, {
                    text: '⚠️ *Auto Status Already Disabled*\n\n' +
                          `🔧 Use *.autostatus on* to enable auto viewing`
                }, { quoted: message });
                return;
            }
            
            config.enabled = false;
            saveStatusConfig(config);
            
            await sock.sendMessage(chatId, {
                text: '❌ *Auto Status Disabled*\n\n' +
                      '🔄 Bot will no longer automatically view status updates\n\n' +
                      `⚙️ Use *.autostatus on* to re-enable`
            }, { quoted: message });
            break;

        case 'time':
            const timeframe = parseInt(value);
            if (isNaN(timeframe) || timeframe < 5 || timeframe > 600) {
                await sock.sendMessage(chatId, {
                    text: '❌ *Invalid Timeframe*\n\n' +
                          '⏱️ Please provide a value between 5-600 seconds\n\n' +
                          '*Examples:*\n' +
                          '• *.autostatus time 30* (30 seconds)\n' +
                          '• *.autostatus time 60* (1 minute)\n' +
                          '• *.autostatus time 120* (2 minutes)\n\n' +
                          '💡 *Recommended:* 30-120 seconds for natural behavior'
                }, { quoted: message });
                return;
            }
            
            config.timeframe = timeframe;
            saveStatusConfig(config);
            
            const enabledText = config.enabled ? 'enabled' : 'disabled';
            await sock.sendMessage(chatId, {
                text: `⏱️ *Viewing Delay Updated*\n\n` +
                      `🔧 New timeframe: ${timeframe} seconds\n` +
                      `📊 Auto Status: ${enabledText}\n\n` +
                      `${config.enabled ? '✅ Changes will apply to new status updates' : '💡 Enable auto status to use this setting'}`
            }, { quoted: message });
            break;

        case 'status':
            const statusIcon = config.enabled ? '🟢' : '🔴';
            const statusText = config.enabled ? 'ENABLED' : 'DISABLED';
            
            await sock.sendMessage(chatId, {
                text: `📊 *AUTO STATUS SETTINGS*\n\n` +
                      `${statusIcon} *Status:* ${statusText}\n` +
                      `⏱️ *Viewing Delay:* ${config.timeframe} seconds\n` +
                      `🕒 *Last Updated:* ${new Date().toLocaleString()}\n\n` +
                      `${config.enabled ? '✅ Auto viewing is active' : '❌ Auto viewing is disabled'}\n\n` +
                      `🔧 Use *.autostatus* to see all available commands`
            }, { quoted: message });
            break;

        default:
            await sock.sendMessage(chatId, {
                text: '❌ *Invalid Command*\n\n' +
                      '🔧 Available options:\n' +
                      '• *on* - Enable auto viewing\n' +
                      '• *off* - Disable auto viewing\n' +
                      '• *time <seconds>* - Set viewing delay\n' +
                      '• *status* - Check current settings\n\n' +
                      '💡 Example: *.autostatus time 45*'
            }, { quoted: message });
            break;
    }
}

async function handleStatusUpdate(sock, statusUpdate) {
    try {
        const config = loadStatusConfig();
        
        if (!config.enabled) return;
        
        // Add random delay based on timeframe setting
        const minDelay = Math.max(config.timeframe - 10, 5);
        const maxDelay = config.timeframe + 10;
        const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        
        setTimeout(async () => {
            try {
                if (statusUpdate.messages) {
                    for (const message of statusUpdate.messages) {
                        if (message.key && message.key.remoteJid === 'status@broadcast') {
                            await sock.readMessages([message.key]);
                        }
                    }
                }
            } catch (error) {
                console.error('Error auto-viewing status:', error);
            }
        }, randomDelay * 1000);
        
    } catch (error) {
        console.error('Error in handleStatusUpdate:', error);
    }
}

module.exports = { autoStatusCommand, handleStatusUpdate };
