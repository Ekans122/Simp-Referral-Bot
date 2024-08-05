const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// Use environment variables for sensitive information
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BACKEND_URL = process.env.BACKEND_URL;

const { handleUsername } = require('./game.js');

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

bot.on('message', async msg => {
  try {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username;

    const { text } = msg;
    const COMMANDS = text ? text.toUpperCase() : '';

    if (!text) return;

    handleUsername(bot, chatId, userId, username);
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const userId = msg.from.id;
  const first_name = msg.from.first_name || 'Anonymous';
  const last_name = msg.from.last_name || '';
  const referralCode = match[1]; // Extracted from the start parameter
  
  try {
    const res = await axios.post(`${BACKEND_URL}/api/v1/users/addReferral`, {
      user: referralCode,
      friend_id: userId,
      friend_username: username,
    });
    console.log('--//---OK!!!----//---', res.data);
    console.log('--//---referrerUsername----//---', referralCode);
    console.log('--//---USER_NAME----//---', username, userId);
  } catch (error) {
    console.error(error);
  }
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});