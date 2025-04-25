// index.js - Telegram version
console.clear();
console.log('Starting...');
require('./setting/config');

const { Telegraf } = require('telegraf');
const fs = require('fs');
const pino = require('pino');

async function startBot() {
    const bot = new Telegraf(global.token);
    bot.use(async (ctx, next) => {
        try {
            await require("./case")(bot, ctx);
            await next();
        } catch (err) {
            console.error(err);
        }
    });

    bot.launch().then(() => {
        console.log('Bot Berhasil Tersambung');
    });

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    return bot;
}

startBot();

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
    require('fs').unwatchFile(file);
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
    delete require.cache[file];
    require(file);
});