import express from "express";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
// Use environment variables for sensitive information

import { TOKEN, BACKEND_URL, PORT, dbConnect, REFERRALLINK } from './config.js';
import { handleUsername } from "./game.js";


dbConnect();

// Create an Express app
const app = express();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, { polling: true });

// Webhook route
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Health check route
app.get('/', (req, res) => {
  res.send('Bot is running!');
});

bot.on('chat_invite_link', async (ctx) => {
  const invite_link = ctx.invite_link;

  // Check if the user joined via an invite link
  if (invite_link) {
    // Parse the invite link to extract the ref parameter
    const urlParams = new URLSearchParams(new URL(invite_link).search);
    const refParam = urlParams.get('ref');

    if (refParam) {
      console.log(`User joined with ref parameter: ${refParam}`);
      // Perform any actions you need with the ref parameter
      // For example, you might want to store it in your database
      // or use it to track referrals
    }
  }
});

bot.on('message', async msg => {
  try {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username;

    const { text } = msg;
    if (msg.new_chat_members) {
      const newMembers = msg.new_chat_members.map(m => m.username).join(', ');
      await bot.sendMessage(chatId, `New members joined: ${newMembers}`);
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
        await bot.sendMessage(chatId, `Your referral link is: ${REFERRALLINK}?ref=${userId}`);
        break;
      default:
    }
  } catch (err) {
    console.error(err);
  }
});

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === 'myreferral') {
    text = 'Edited Text';
  }

  bot.editMessageText(text, opts);
});

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const userId = msg.from.id;
  const referralCode = match[1]; // Extracted from the start parameter
  console.log('--//---USER_NAME----//---', username, userId, referralCode);

  try {
    const res = await axios.post(`${BACKEND_URL}/friend/addreferral`, {
      username: username,
      userId: userId,
      referralCode: referralCode,
    });
    console.log('--//---OK!!!----//---', res.data);
    console.log('--//---referrerUsername----//---', referralCode);
    console.log('--//---USER_NAME----//---', username, userId);
  } catch (error) {
    console.error(error);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});