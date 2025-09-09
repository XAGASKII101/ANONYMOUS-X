// Polyfill for File in Node <20
if (typeof File === "undefined") {
  global.File = class File extends Blob {
    constructor(chunks, filename, options = {}) {
      super(chunks, options);
      this.name = filename;
      this.lastModified = options.lastModified || Date.now();
    }
  };
}
/**
 * ANONYMOUS X Bot - A Advanced WhatsApp Bot
 * Copyright (c) 2024 ANONYMOUS X
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 */
require("./lib/polyfills")
require("./settings")
const { Boom } = require("@hapi/boom")
const fs = require("fs")
const punycode = require('punycode/')
const chalk = require("chalk")
const FileType = require("file-type")
const path = require("path")
const axios = require("axios")
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require("./main")
const PhoneNumber = require("awesome-phonenumber")
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("./lib/exif")
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require("./lib/myfunc")
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  jidDecode,
  proto,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  delay,
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require("@whiskeysockets/baileys/lib/Utils/generics")
const { rmSync, existsSync } = require("fs")
const { join } = require("path")

// Create a store object with required methods
const store = {
  messages: {},
  contacts: {},
  chats: {},
  groupMetadata: async (jid) => {
    return {}
  },
  bind: function (ev) {
    ev.on("messages.upsert", ({ messages }) => {
      messages.forEach((msg) => {
        if (msg.key && msg.key.remoteJid) {
          this.messages[msg.key.remoteJid] = this.messages[msg.key.remoteJid] || {}
          this.messages[msg.key.remoteJid][msg.key.id] = msg
        }
      })
    })

    ev.on("contacts.update", (contacts) => {
      contacts.forEach((contact) => {
        if (contact.id) {
          this.contacts[contact.id] = contact
        }
      })
    })

    ev.on("chats.set", (chats) => {
      this.chats = chats
    })
  },
  loadMessage: async (jid, id) => {
    return this.messages[jid]?.[id] || null
  },
}

const owner = JSON.parse(fs.readFileSync("./data/owner.json"))

global.botname = "ANONYMOUS X"
global.themeemoji = "🔰"

const settings = require("./settings")
const pairingCode = process.argv.includes("--pairing-code") || process.argv.includes("--pair")
const useMobile = process.argv.includes("--mobile")

// Always ask for phone number instead of using hardcoded one
let rl = null
const question = (text) => {
  if (!rl) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  }
  return new Promise((resolve) => rl.question(text, resolve))
}

async function startXeonBotInc() {
  const { version, isLatest } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState(`./session`)
  const msgRetryCounterCache = new NodeCache()

  const XeonBotInc = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      const jid = jidNormalizedUser(key.remoteJid)
      const msg = await store.loadMessage(jid, key.id)
      return msg?.message || ""
    },
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
    connectTimeoutMs: 60000,
    retryRequestDelayMs: 2000,
  })

  store.bind(XeonBotInc.ev)

  // Message handling
  XeonBotInc.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const mek = chatUpdate.messages[0]
      if (!mek.message) return
      mek.message =
        Object.keys(mek.message)[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message
      if (mek.key && mek.key.remoteJid === "status@broadcast") {
        await handleStatus(XeonBotInc, chatUpdate)
        return
      }
      if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === "notify") return
      if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 16) return

      try {
        await handleMessages(XeonBotInc, chatUpdate, true)
      } catch (err) {
        console.error("Error in handleMessages:", err)
        if (mek.key && mek.key.remoteJid) {
          await XeonBotInc.sendMessage(mek.key.remoteJid, {
            text: "❌ An error occurred while processing your message."
          }).catch(console.error)
        }
      }
    } catch (err) {
      console.error("Error in messages.upsert:", err)
    }
  })

  XeonBotInc.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {}
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid
    } else return jid
  }

  XeonBotInc.ev.on("contacts.update", (update) => {
    for (const contact of update) {
      const id = XeonBotInc.decodeJid(contact.id)
      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
    }
  })

  XeonBotInc.getName = (jid, withoutContact = false) => {
    const id = XeonBotInc.decodeJid(jid)
    withoutContact = XeonBotInc.withoutContact || withoutContact
    let v
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {}
        if (!(v.name || v.subject)) v = (await XeonBotInc.groupMetadata(id)) || {}
        resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"))
      })
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === XeonBotInc.decodeJid(XeonBotInc.user.id)
            ? XeonBotInc.user
            : store.contacts[id] || {}
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international")
    )
  }

  XeonBotInc.public = true
  XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

  // Handle pairing code logic
  if (!XeonBotInc.authState.creds.registered) {
    if (useMobile) {
      console.log(chalk.red("❌ Mobile API not supported. Use pairing code instead."))
      process.exit(1)
    }

    console.log(chalk.cyan("\n🔗 Device not registered! Starting pairing process...\n"))
    
    // Auto-pair with fixed number
const cleanNumber = "2348107516059"

console.log(chalk.yellow(`\n🔄 Requesting pairing code for +${cleanNumber}...`))

    // Validate phone number
    if (cleanNumber.length < 8 || cleanNumber.length > 15) {
      console.log(chalk.red("❌ Invalid phone number length. Please enter a valid international number."))
      if (rl) rl.close()
      process.exit(1)
    }

    console.log(chalk.yellow(`\n🔄 Requesting pairing code for +${cleanNumber}...`))
    
    try {
      let code = await XeonBotInc.requestPairingCode(cleanNumber)
      code = code?.match(/.{1,4}/g)?.join("-") || code
      
      console.log(chalk.green("\n" + "=".repeat(50)))
      console.log(chalk.black(chalk.bgGreen(`✅ YOUR PAIRING CODE: `)), chalk.black(chalk.bold(code)))
      console.log(chalk.cyan(`📱 Phone Number: +${cleanNumber}`))
      console.log(chalk.green("=".repeat(50)))
      console.log(
        chalk.yellow(
          `\n📋 How to link your device:\n` +
          `1. Open WhatsApp on your phone\n` +
          `2. Go to Settings ⚙️\n` +
          `3. Tap "Linked Devices" 📱\n` +
          `4. Tap "Link a Device" ➕\n` +
          `5. Enter this code: ${code}\n\n` +
          `⏱️  Code expires in 60 seconds!\n` +
          `🔄 Waiting for device to be linked...`,
        ),
      )
      
      // Close readline interface
      if (rl) {
        rl.close()
        rl = null
      }
      
    } catch (error) {
      console.error(chalk.red("❌ Error requesting pairing code:"), error.message)
      console.log(chalk.red("💡 Please check your phone number and internet connection."))
      if (rl) rl.close()
      process.exit(1)
    }
  }

  // Connection handling
  XeonBotInc.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect, qr } = s
    
    if (qr) {
      console.log(chalk.cyan("📱 QR Code received but pairing code mode is active."))
    }
    
    if (connection === "connecting") {
      console.log(chalk.yellow("🔄 Connecting to WhatsApp..."))
    }
    
    if (connection === "open") {
      console.log(chalk.green("\n✅ Successfully connected to WhatsApp!"))
      console.log(chalk.cyan(`🎉 Bot User: ${XeonBotInc.user?.name || 'Unknown'}`))
      console.log(chalk.cyan(`📱 Phone: ${XeonBotInc.user?.id?.split(':')[0] || 'Unknown'}`))

      // Close readline interface if still open
      if (rl) {
        rl.close()
        rl = null
      }

      await delay(1000)
      console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || "ANONYMOUS X"} ]`)}\n\n`))
      console.log(chalk.cyan(`< ================================================== >`))
      console.log(chalk.magenta(`\n${global.themeemoji || "🔰"} YT CHANNEL: ANONYMOUS X`))
      console.log(chalk.magenta(`${global.themeemoji || "🔰"} GITHUB: anonymousx`))
      console.log(chalk.magenta(`${global.themeemoji || "🔰"} OWNER: Alexius Dubem`))
      console.log(chalk.magenta(`${global.themeemoji || "🔰"} CREDIT: ANONYMOUS X`))
      console.log(chalk.green(`${global.themeemoji || "🔰"} 🤖 Bot Ready! ✅`))
      console.log(chalk.cyan(`< ================================================== >\n`))
    }
    
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode
      const shouldReconnect = reason !== DisconnectReason.loggedOut
      
      console.log(chalk.red("❌ Connection closed:"), lastDisconnect?.error?.message || "Unknown error")
      
      if (reason === DisconnectReason.badSession) {
        console.log(chalk.red("🗑️ Bad session file. Please delete session folder and restart."))
        process.exit(1)
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log(chalk.yellow("🔄 Connection closed. Reconnecting..."))
        setTimeout(() => startXeonBotInc(), 3000)
      } else if (reason === DisconnectReason.connectionLost) {
        console.log(chalk.yellow("📡 Connection lost. Reconnecting..."))
        setTimeout(() => startXeonBotInc(), 3000)
      } else if (reason === DisconnectReason.restartRequired) {
        console.log(chalk.yellow("🔄 Restart required. Reconnecting..."))
        setTimeout(() => startXeonBotInc(), 3000)
      } else if (shouldReconnect) {
        console.log(chalk.yellow("🔄 Reconnecting..."))
        setTimeout(() => startXeonBotInc(), 5000)
      } else {
        console.log(chalk.red("🚫 Logged out. Please restart the bot."))
        process.exit(1)
      }
    }
  })

  XeonBotInc.ev.on("creds.update", saveCreds)
  XeonBotInc.ev.on("group-participants.update", async (update) => {
    await handleGroupParticipantUpdate(XeonBotInc, update)
  })

  XeonBotInc.ev.on("messages.upsert", async (m) => {
    if (m.messages[0].key && m.messages[0].key.remoteJid === "status@broadcast") {
      await handleStatus(XeonBotInc, m)
    }
  })

  XeonBotInc.ev.on("status.update", async (status) => {
    await handleStatus(XeonBotInc, status)
  })

  XeonBotInc.ev.on("messages.reaction", async (status) => {
    await handleStatus(XeonBotInc, status)
  })

  return XeonBotInc
}

startXeonBotInc().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
})

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
})

const file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
}) 