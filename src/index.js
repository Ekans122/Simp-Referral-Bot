import express from "express";
import TelegramBot from "node-telegram-bot-api";
// Use environment variables for sensitive information

import { TOKEN, PORT, dbConnect, REFERRALLINK } from './config.js';
import { handleReferral, handleUsername, handleReferralVerification, handleGetList } from "./game.js";


dbConnect();

// Create an Express app
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const userId = msg.from.id;
  const referralCode = match[1]; // Extracted from the start parameter
  console.log('--//---USER_NAME----//---', username, userId, referralCode);
  const res = await handleReferral(username, userId.toString(), referralCode.toString());
  if (res.status === 'success') {
    await bot.sendMessage(chatId, res.message, res.options);
  } else {
    await bot.sendMessage(chatId, res.message);
  }
  console.log('REFERRAL RESPONSE', res);
});

bot.on('message', async msg => {
  try {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username;

    const { text } = msg;
    if (msg.new_chat_members) {
      for (const member of msg.new_chat_members) {
        console.log('New member:', member);
        const res = await handleReferralVerification(member);
        if (res.status === 'success') {
          await bot.sendMessage(chatId, res.message, res.options);
        } else {
          await bot.sendMessage(chatId, res.message);
        }
      }
      return;
    }
    const COMMANDS = text ? text.toUpperCase() : '';
    console.log(`Received message from ${username} (${userId}): ${text}`);
    if (!text) return;
    switch (COMMANDS) {
      case '/START':
        handleUsername(bot, chatId, userId, username);
        break;
      case '/MYREFERRAL':
        await bot.sendMessage(chatId, `Your referral link is: ${REFERRALLINK}?start=${userId}`);
        break;
      case '/LEADERBOARD':
        const res = await handleGetList();
        await bot.sendMessage(chatId, res.message);
        break;
      default:
    }
  } catch (err) {
    console.error(err);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});