
# 🤖 ANONYMOUS X - Advanced WhatsApp Bot

<p align="center">
  <img src="bot_img.jpg" alt="ANONYMOUS X Bot" width="300">
</p>

<p align="center">
  <b>The Ultimate WhatsApp Bot Experience</b><br>
  Developed by <a href="https://github.com/alexius-dubem">Alexius Dubem</a>
</p>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Commands](#commands)
- [Configuration](#configuration)
- [Support](#support)

---

## 🎯 About

**ANONYMOUS X** is a cutting-edge WhatsApp bot designed to provide comprehensive functionality for personal and group management. Built with modern technologies and featuring an extensive command library, this bot transforms your WhatsApp experience.

### 👨‍💻 Developer Information
- **Creator:** Alexius Dubem
- **Bot Name:** ANONYMOUS X
- **Version:** 3.0.0
- **Channel:** [ANONYMOUS X Channel](https://whatsapp.com/channel/0029Vb6K4Nh4Crfdee0XJe35)

---

## ✨ Features

### 🔐 Privacy & Security
- **View Once Decryption** - Decrypt and save view-once media
- **Anti-Delete** - Retrieve deleted messages
- **Private Media Forwarding** - Auto-forward decrypted content privately

### 🎬 Entertainment & Media
- **Movie Downloads** - Download latest movies and series
- **Anime Downloads** - Access to anime content
- **Music & Video** - YouTube, Instagram, TikTok, Facebook downloaders
- **Media Conversion** - Convert between different media formats
- **Sticker Creation** - Create custom stickers from images/videos

### 🎮 Games & Fun
- **Tic-Tac-Toe** - Classic game with friends
- **Hangman** - Word guessing game
- **Trivia** - Knowledge-based quiz games
- **Truth or Dare** - Fun party games
- **8-Ball** - Magic 8-ball predictions
- **Ship** - Compatibility calculator

### 📰 Information & Utilities
- **Dictionary** - Word definitions and meanings
- **Translation** - Translate text to any language
- **News Updates** - Latest news from around the world
- **Weather** - Real-time weather information
- **Crypto Updates** - Cryptocurrency prices and trends
- **Horoscopes** - Daily astrological predictions
- **Facts & Quotes** - Random facts and inspirational quotes

### 👥 Group Management
- **Admin Controls** - Promote, demote, kick, ban members
- **Welcome/Goodbye** - Custom messages for new/leaving members
- **Anti-Link** - Prevent spam links
- **Anti-Badword** - Filter inappropriate content
- **Mute/Unmute** - Temporary member restrictions
- **Group Info** - Detailed group statistics

### 🤖 AI & Automation
- **ChatGPT Integration** - AI-powered conversations
- **Auto Status View** - Automatically view status updates with custom timeframes
- **Auto Reactions** - Smart reaction system
- **Bulk Messaging** - Send broadcasts to contact lists
- **Custom Responses** - Automated chat responses

### 🎨 Creative Tools
- **Text Effects** - Create stunning text designs (metallic, neon, fire, etc.)
- **Image Generation** - AI-powered image creation
- **Profile Picture** - Auto-set profile pictures
- **Character Analysis** - Personality insights

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- WhatsApp account
- Stable internet connection

### Quick Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/anonymous-x-bot
   cd anonymous-x-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Bot**
   ```bash
   npm start
   ```

4. **Pairing Process**
   - The bot will prompt for your WhatsApp number
   - Enter your number in international format (without + or spaces)
   - A pairing code will be generated
   - Open WhatsApp → Settings → Linked Devices → Link a Device
   - Enter the provided code

---

## 📱 Commands

### 🎮 Entertainment
| Command | Description | Usage |
|---------|-------------|-------|
| `.play <song>` | Download music from YouTube | `.play shape of you` |
| `.video <title>` | Download video from YouTube | `.video funny cats` |
| `.movie <title>` | Search and download movies | `.movie avengers` |
| `.anime <name>` | Search and download anime | `.anime naruto` |
| `.instagram <url>` | Download Instagram content | `.instagram [URL]` |
| `.tiktok <url>` | Download TikTok videos | `.tiktok [URL]` |
| `.sticker` | Convert image/video to sticker | Reply to media |

### 🎲 Games
| Command | Description | Usage |
|---------|-------------|-------|
| `.ttt` | Start Tic-Tac-Toe game | `.ttt` |
| `.hangman` | Start Hangman game | `.hangman` |
| `.trivia` | Start trivia quiz | `.trivia` |
| `.truth` | Get truth question | `.truth` |
| `.dare` | Get dare challenge | `.dare` |
| `.8ball <question>` | Magic 8-ball | `.8ball Will I be rich?` |
| `.ship` | Calculate compatibility | `.ship` (in group) |

### ℹ️ Information
| Command | Description | Usage |
|---------|-------------|-------|
| `.define <word>` | Dictionary lookup | `.define beautiful` |
| `.translate <text>` | Translate text | `.translate hello to spanish` |
| `.weather <city>` | Weather information | `.weather london` |
| `.news` | Latest news | `.news` |
| `.crypto <coin>` | Crypto prices | `.crypto bitcoin` |
| `.horoscope <sign>` | Daily horoscope | `.horoscope aries` |
| `.fact` | Random fact | `.fact` |
| `.quote` | Inspirational quote | `.quote` |

### 👥 Group Management
| Command | Description | Usage |
|---------|-------------|-------|
| `.add <number>` | Add member to group | `.add 1234567890` |
| `.kick @user` | Remove member | `.kick @user` |
| `.promote @user` | Make admin | `.promote @user` |
| `.demote @user` | Remove admin | `.demote @user` |
| `.mute <minutes>` | Mute group | `.mute 30` |
| `.unmute` | Unmute group | `.unmute` |
| `.ban @user` | Ban user from bot | `.ban @user` |
| `.tagall` | Tag all members | `.tagall` |
| `.antilink on/off` | Toggle anti-link | `.antilink on` |

### 🔧 Admin & Owner
| Command | Description | Usage |
|---------|-------------|-------|
| `.mode public/private` | Set bot access mode | `.mode public` |
| `.autostatus on/off/time` | Auto status settings | `.autostatus time 30` |
| `.antidelete on/off` | Toggle anti-delete | `.antidelete on` |
| `.clearsession` | Clear bot session | `.clearsession` |
| `.setpp` | Set profile picture | Reply to image |

### 🎨 Creative
| Command | Description | Usage |
|---------|-------------|-------|
| `.imagine <prompt>` | Generate AI image | `.imagine sunset beach` |
| `.metallic <text>` | Metallic text effect | `.metallic ANONYMOUS` |
| `.neon <text>` | Neon text effect | `.neon GLOW` |
| `.fire <text>` | Fire text effect | `.fire BURN` |
| `.blur` | Blur image effect | Reply to image |

---

## ⚙️ Configuration

### Bot Settings
Edit `settings.js` to customize:
```javascript
const settings = {
  packname: "ANONYMOUS X",
  author: "Alexius Dubem", 
  botName: "ANONYMOUS X",
  ownerNumber: "2348107516059",
  channelLink: "https://whatsapp.com/channel/0029Vb6K4Nh4Crfdee0XJe35"
}
```

### Auto Status Configuration
- Default timeframe: 30 seconds
- Recommended range: 15-120 seconds
- Use `.autostatus time <seconds>` to adjust

### Group Features
- Anti-link protection
- Bad word filtering
- Welcome/goodbye messages
- Auto-moderation tools

---

## 🛠️ Advanced Features

### View Once Decryption
- Automatically saves decrypted media to gallery
- Forwards content privately to owner
- Maintains sender information and timestamps

### Media Conversion
- Video to audio conversion
- Image format conversion
- Compression and optimization

### Bulk Messaging
- Broadcast to contact lists
- Scheduled message sending
- Custom message templates

---

## 🔒 Privacy & Security

- All personal data is stored locally
- No data sharing with third parties
- Secure session management
- Encrypted message storage

---

## 📞 Support

### Developer Contact
- **WhatsApp:** +234 810 751 6059
- **Channel:** [ANONYMOUS X Channel](https://whatsapp.com/channel/0029Vb6K4Nh4Crfdee0XJe35)
- **GitHub:** Alexius Dubem

### Common Issues
1. **Pairing Failed:** Ensure number format is correct (no + or spaces)
2. **Commands Not Working:** Check if bot has admin permissions
3. **Download Errors:** Verify internet connection and URL validity

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- WhatsApp Business API
- Baileys Library
- OpenAI API
- Various media download APIs
- Contributors and beta testers

---

<p align="center">
  <b>⭐ If you find this bot useful, please star the repository! ⭐</b>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/alexius-dubem">Alexius Dubem</a>
</p>
