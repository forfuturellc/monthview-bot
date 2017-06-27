/**
 * Month-View Bot
 * Mohammed Sohail <sohail@forfuture.tech>
 * 
 * Released under AGPL-3.0
 * 
 */


// npm-installed modules
const _ = require("lodash");
const calendar = require("node-calendar");
const TelegramBot = require("node-telegram-bot-api");


// module variables
const bot = new TelegramBot(process.env.TOKEN, {
    polling: true,
    onlyFirstMatch: true,
});


// bot logic
bot.onText(/^\/start$/, (msg) => {
    return bot.sendMessage(msg.chat.id, "Hi, this is a PoC of generating month view calendars on Telegram with inline buttons only.\n\n/month [month]/[year]");
});

bot.onText(/^\/month (1|2|3|4|5|6|7|8|9|10|11|12)\/(\d{4})$/, (msg, match) => {
    const month = new calendar.Calendar().monthdayscalendar(match[2], match[1]);
    const array = [];

    array.push({ text: "Mon", callback_data: "null" }, { text: "Tue", callback_data: "null" }, { text: "Wed", callback_data: "null" }, { text: "Thu", callback_data: "null" }, { text: "Fri", callback_data: "null" }, { text: "Sat", callback_data: "null" }, { text: "Sun", callback_data: "null" });

    _.map(month, (weeks) => {
        return _.forEach(weeks, (days) => {
            const object = {};

            object.text = JSON.stringify(days);
            object.callback_data = JSON.stringify(`${days}/${match[1]}/${match[2]}`);

            array.push(object);
        });
    });

    const cleanedArray = _.map(array, (object) => {
        return object.text === "0" ? { text: " ", callback_data: "null" } : object;
    });

    const renderMonth = _.chunk(cleanedArray, 7);

    return bot.sendMessage(msg.chat.id, `Here is the genrated view for ${match[1]}/${match[2]}`, {
        reply_markup: {
            inline_keyboard: renderMonth,
        }
    });
});

bot.onText(/.+/, (msg) => {
    bot.sendMessage(msg.chat.id, "Invalid input");
});

bot.on("callback_query", (msg) => {
    if (msg.data === "null") {
      return bot.answerCallbackQuery(msg.id, "Nothing selected");
    }
    return bot.answerCallbackQuery(msg.id, msg.data);
});