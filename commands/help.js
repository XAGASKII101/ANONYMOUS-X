
const fs = require('fs');
const settings = require('../settings.js');

async function helpCommand(sock, chatId, message, channelLink) {
    try {
        const menuText = `
╭━━★彡 𝒜𝒩𝒪𝒩𝒴𝑀𝒪𝒰𝒮 𝒳 彡★━━╮
┃  🔰 Prefix: .
┃  🔰 Name: ANONYMOUS X 
┃  🔰 Creator: ANONYMOUS X 
╰━━━━━━━━━━━━━╯ 
ꕥ *.support* for official group

*📲 DOWNLOADERS 📲*
┣ ✦ .instagram / .ig
┣ ✦ .tiktok / .tt
┣ ✦ .youtube / .yt
┣ ✦ .twitter / .x
┣ ✦ .facebook / .fb
┣ ✦ .play [song name]
┣ ✦ .video [video name]
┣ ✦ .song [song name]
┗━━━━━━━━━━━

*🔍 SEARCH 🔍*
┣ ✦ .pinterest / .pint 
┣ ✦ .sauce / .reverseimg 
┣ ✦ .wallpaper
┣ ✦ .lyrics [song]
┣ ✦ .weather [city]
┣ ✦ .news
┗━━━━━━━━━━━

*🤖 AI COMMANDS 🤖*
┣ ✦ .gpt [question]
┣ ✦ .gemini [question]
┣ ✦ .imagine [prompt]
┣ ✦ .upscale [reply to image]
┣ ✦ .translate [text]
┣ ✦ .transcribe [reply to audio]
┗━━━━━━━━━━━

*👤 CONVERTER 👤*
┣ ✦ .sticker / .s
┣ ✦ .take [packname] [author]
┣ ✦ .toimg [reply to sticker]
┣ ✦ .tovid [reply to gif]
┣ ✦ .simage [reply to sticker]
┣ ✦ .viewonce / .vv [reply to view once]
┗━━━━━━━━━━━

*🎮 GAMES 🎮*
┣ ✦ .tictactoe / .ttt
┣ ✦ .hangman
┣ ✦ .trivia
┣ ✦ .8ball [question]
┣ ✦ .dare
┣ ✦ .truth
┗━━━━━━━━━━━

*👤 FUN 👤*
┣ ✦ .joke
┣ ✦ .meme
┣ ✦ .quote
┣ ✦ .fact
┣ ✦ .compliment [@user]
┣ ✦ .insult [@user]
┣ ✦ .ship [reply or mention 2 users]
┣ ✦ .simp [@user]
┣ ✦ .stupid [@user]
┣ ✦ .flirt
┣ ✦ .goodnight
┣ ✦ .shayari
┣ ✦ .roseday
┗━━━━━━━━━━━

*⚙️ ADMIN ⚙️*
┣ ✦ .kick [@user]
┣ ✦ .ban [@user]
┣ ✦ .unban [@user]
┣ ✦ .promote [@user]
┣ ✦ .demote [@user]
┣ ✦ .mute [minutes]
┣ ✦ .unmute
┣ ✦ .warn [@user] [reason]
┣ ✦ .warnings [@user]
┣ ✦ .delete / .del
┣ ✦ .tagall
┣ ✦ .antilink [on/off]
┣ ✦ .antibadword [on/off]
┣ ✦ .welcome [on/off]
┣ ✦ .goodbye [on/off]
┣ ✦ .groupinfo
┣ ✦ .resetlink
┣ ✦ .staff
┗━━━━━━━━━━━

*🛠️ UTILITY 🛠️*
┣ ✦ .ping
┣ ✦ .alive
┣ ✦ .owner
┣ ✦ .support
┣ ✦ .github / .sc
┣ ✦ .topmembers
┣ ✦ .jid
┣ ✦ .ss [url]
┣ ✦ .tts [text]
┣ ✦ .attp [text]
┣ ✦ .emojimix [emoji1+emoji2]
┣ ✦ .blur [reply to image]
┣ ✦ .wasted [reply to image]
┣ ✦ .character [reply to image]
┗━━━━━━━━━━━

*🎨 TEXT MAKERS 🎨*
┣ ✦ .metallic [text]
┣ ✦ .ice [text]
┣ ✦ .snow [text]
┣ ✦ .matrix [text]
┣ ✦ .neon [text]
┣ ✦ .fire [text]
┣ ✦ .thunder [text]
┣ ✦ .hacker [text]
┣ ✦ .glitch [text]
┣ ✦ .blackpink [text]
┗━━━━━━━━━━━

*👑 OWNER ONLY 👑*
┣ ✦ .mode [public/private]
┣ ✦ .autostatus [on/off]
┣ ✦ .antidelete [on/off]
┣ ✦ .clearsession
┣ ✦ .cleartmp
┣ ✦ .setpp [reply to image]
┣ ✦ .areact [on/off]
┣ ✦ .whoami
┣ ✦ .removecmd [reply to image command]
┗━━━━━━━━━━━

> *ANONYMOUS X - Advanced WhatsApp Bot*
> *Join our channel for updates*`;

        await sock.sendMessage(chatId, {
            text: menuText
        }, { quoted: message });

    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error displaying menu!'
        });
    }
}

module.exports = helpCommand;
