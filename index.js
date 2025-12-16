const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("CK ERROR BOT Running"));
app.listen(3000);

// ===== CONFIG =====
const BOT_TOKEN = "8465321007:AAFbaEcgx2oUPg-ucGNRaQ35HyIkR0NoRws";
const ADMIN_ID = 6877097857; // <-- তোমার Telegram numeric ID বসাও

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ===== START =====
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👾 *CK ERROR VIRTUAL SERVICE*\n\n` +
    `Welcome! Please select your country 👇`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🇮🇳 India", callback_data: "country_india" }],
          [{ text: "🇺🇸 USA", callback_data: "country_usa" }],
          [{ text: "🇬🇧 UK", callback_data: "country_uk" }],
          [{ text: "🇨🇦 Canada", callback_data: "country_canada" }],
          [{ text: "🌍 Other Country", callback_data: "country_other" }]
        ]
      }
    }
  );
});

// ===== COUNTRY SELECT =====
bot.on("callback_query", (q) => {
  const chatId = q.message.chat.id;
  const country = q.data.replace("country_", "");

  bot.sendMessage(
    chatId,
    `✅ *Request Submitted*\n\nCountry: *${country.toUpperCase()}*\n\n` +
    `Our team will contact you soon.`,
    { parse_mode: "Markdown" }
  );

  // Notify Admin
  bot.sendMessage(
    ADMIN_ID,
    `📥 *New Request*\n\nUser: ${chatId}\nCountry: ${country.toUpperCase()}`,
    { parse_mode: "Markdown" }
  );

  bot.answerCallbackQuery(q.id);
});

// ===== CONTACT =====
bot.onText(/\/contact/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `📩 *Contact Admin*\n\nPlease wait, admin will reply manually.`,
    { parse_mode: "Markdown" }
  );

  bot.sendMessage(
    ADMIN_ID,
    `📨 User ${msg.chat.id} wants to contact you.`,
  );
});

// ===== ADMIN REPLY HELP =====
bot.onText(/\/reply (.+)/, (msg, match) => {
  if (msg.chat.id !== ADMIN_ID) return;

  const parts = match[1].split(" ");
  const userId = parts.shift();
  const replyText = parts.join(" ");

  bot.sendMessage(userId, `📩 Admin Reply:\n${replyText}`);
});
