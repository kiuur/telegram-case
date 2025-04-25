// bot.js - Telegram version using Telegraf
const fs = require('fs');
const util = require("util");
const moment = require("moment-timezone");
const { Telegraf } = require('telegraf');
const yts = require('yt-search')
const path = require('path')
const { message } = require('telegraf/filters');

module.exports = client = async (client, ctx) => {
  try {
    const msg = ctx.message || ctx.callbackQuery?.message || {};
    const from = ctx.chat.id;
    //const from = ctx.from || ctx.callbackQuery?.from || {};
    const chat = ctx.chat || msg.chat || {};
    const sender = ctx.from.id;
    const senderNumber = sender?.toString() || '';
    
    const messageId = msg.message_id || null;
    //const body = ctx.message.text || ctx.message.caption || '';
    const body = msg.text || msg.caption || ctx.callbackQuery?.data || '';
    const budy = body;
    const prefa = ["", "!", ".", ",", "🐤", "🗿"];
    const prefixMatch = body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/);
    const prefix = prefixMatch ? prefixMatch[0] : '.';
    
    const fromChatId = chat.id || null;
    const isGroup = chat.type !== 'private' && chat.type !== undefined;
    
    //database JSON
    const kontributor = JSON.parse(fs.readFileSync('./database/owner.json'));
    const botNumber = ctx.botInfo?.id || '';
    const Access = [botNumber.toString(), ...kontributor].map(v => v.toString()).includes(sender?.toString());
    
    const isCmd = body.startsWith(prefix);
    const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = from.first_name || "No Name";
    const text = q = args.join(" ");
    
    const quoted = msg.reply_to_message || null;
    const mime = quoted?.document?.mime_type || 
    quoted?.photo ? 'image' :
    quoted?.video ? 'video' :
    quoted?.audio ? 'audio' :
    quoted?.sticker ? 'sticker' : '';
    const isMedia = !!mime;
    const groupName = isGroup ? chat.title : '';
    const isGroupAdmins = isGroup ? (await ctx.getChatAdministrators()).some(admin => admin.user.id === sender) : false;
    const isBotGroupAdmins = isGroup ? (await ctx.getChatAdministrators()).some(admin => admin.user.id === botNumber) : false;

    const time = moment.tz("Asia/Makassar").format("HH:mm:ss");
    
    // scrape
    const { ytdl } = require("./engine/scrape/ytdl")
    const { fetchJson, sleep } = require("./engine/function")

    console.log('\x1b[30m--------------------\x1b[0m');
    console.log('\x1b[1m\x1b[41m\x1b[97m▢ New Message\x1b[0m');
    console.log('\x1b[42m\x1b[30m' +
      `   ⌬ Tanggal: ${new Date().toLocaleString()} \n` +
      `   ⌬ Pesan: ${body} \n` +
      `   ⌬ Pengirim: ${pushname} \n` +
      `   ⌬ ID: ${sender}\x1b[0m`
    );

    if (isGroup) {
      console.log('\x1b[42m\x1b[30m' +
        `   ⌬ Grup: ${groupName} \n` +
        `   ⌬ GroupID: ${from}\x1b[0m`
      );
    }
    
    console.log();
  
    async function reply(text) {
      ctx.reply(text, {
        reply_to_message_id: ctx.message.message_id
      })
    }
    
    async function replyV2(text) {
      ctx.reply("```\n" + text + "```", {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: "MarkdownV2"
      })
    }
      
    switch (command) {
      case 'start': {
        let bruh = ctx.message.from
        ctx.reply(`hello @${bruh.username}, let me introduce myself, I am laurine, I am an artificial assistant from @kyuucode`, {
          reply_to_message_id: messageId,
          reply_markup: {
            inline_keyboard: [
            [{ text: "start", callback_data: ".menu" }],
            [{ text: "owner", url: "https://t.me/kyuucode" }]
            ]
          }
        })
      }
      break
      case 'menu': {
        let bruh = ctx.from
        let shit = `hallo @${bruh.username}, let me introduce myself i am laurine
      
— info
 ▢ ID: ${bruh.id}
 ▢ name: ${bruh.first_name}
 ▢ username: @${bruh.username}
 
— command:
 ▢ ${prefix}play
 ▢ ${prefix}openai`
        ctx.replyWithPhoto({
          url: "https://github.com/kiuur.png" 
        }, { 
          caption: shit,
          reply_to_message_id: ctx.message.message_id,
          reply_markup: {
            inline_keyboard: [
            [{ text: "Channels", url: "https://t.me/kyuurzy" }]
            ]
          }
        });
      }
      break
      case 'play': {
        if (!text) return reply(`— ex: ${prefix + command} lesung pipi`);
        const mbot = await yts(text);
        const ingfo = mbot.all[0];
        const mb = ingfo.url;
        
        const ah = await ytdl(mb);
        const crt = ah.direct_url;
        const infonya = `process music 🎧
 
— information
 · ID: ${ingfo.videoId}
 · Author: ${ingfo.author.name}
 · Ago: ${ingfo.ago}
 · Duration: ${ingfo.timestamp}

 · description: ${ingfo.description}

© kyuubeyours`
        
        ctx.replyWithPhoto({ 
          url: ingfo.thumbnail
        }, { 
          caption: infonya,
          reply_to_message_id: ctx.message.message_id
        })
        
        return ctx.replyWithAudio({
          url: crt
        }, {
          reply_to_message_id: ctx.message.message_id,
          title: ingfo.title,
          performer: ingfo.author.name,
          reply_markup: {
            inline_keyboard: [
            [{ text: "YouTube", url: ingfo.url }]
            ]
          }
        });
      }
      break
      case 'ai':
      case 'openai': {
        if (!text) return reply(`— ex: ${prefix + command} hallo`)
        let wok = await fetchJson(`https://www.laurine.site/api/ai/heckai?query=${text}`)
        return replyV2(wok.data)
      }
      break
      default: {
        if (ctx.callbackQuery) {
          const callback = ctx.callbackQuery.data
          
          switch (callback) {
            case ".menu": {
              let bruh = ctx.from
              let shit = `hallo @${bruh.username}, let me introduce myself i am laurine
      
— info
 ▢ ID: ${bruh.id}
 ▢ name: ${bruh.first_name}
 ▢ username: @${bruh.username}
 
— command:
 ▢ ${prefix}play
 ▢ ${prefix}openai`
              ctx.replyWithPhoto({
                url: "https://github.com/kiuur.png"
              }, {
                caption: shit,
                reply_to_message_id: messageId,
                reply_markup: {
                  inline_keyboard: [
                  [{ text: "Channels", url: "https://t.me/kyuurzy" }]
                  ]
                }
              });
            }
            break
            default:
            }
          }
        }
        if (budy.startsWith('>')) {
          if (!Access) return;
          try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            if (evaled.length > 4096) {
              const filePath = path.join(__dirname, 'tel', 'result.txt');
              fs.writeFileSync(filePath, evaled);
              
              await ctx.replyWithDocument({
                source: filePath
              }, {
                caption: "result.",
                reply_to_message_id: ctx.message.message_id
              });
              
              fs.unlinkSync(filePath);
            } else {
              await ctx.reply("```\n" + evaled + "\n```", {
                parse_mode: "MarkdownV2",
                reply_to_message_id: ctx.message.message_id
              });
            }
          } catch (err) {
            ctx.reply(String(err));
          }
        }
        
        if (budy.startsWith('$')) {
          if (!Access) return;
          if (text === "rm -r *") return ctx.reply("😹");
          
          const { exec } = require('child_process')
          exec(budy.slice(2), async (err, stdout) => {
            if (err) return ctx.reply(`${err}`);
            
            if (stdout.length > 4096) {
              const filePath = path.join(__dirname, 'result.txt');
              fs.writeFileSync(filePath, stdout);
              
              setTimeout(async () => {
                await ctx.replyWithDocument({
                  source: filePath
                }, {
                  caption: "result.",
                  reply_to_message_id: ctx.message.message_id
                });
                fs.unlinkSync(filePath);
              }, 1000);
            } else {
              ctx.reply("```\n" + stdout + "\n```", {
                parse_mode: "MarkdownV2",
                reply_to_message_id: ctx.message.message_id
              });
            }
          });
        }
      }
    }  catch (err) {
    console.log(require("util").format(err));
  }
};

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file);
  console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
  delete require.cache[file];
  require(file);
});