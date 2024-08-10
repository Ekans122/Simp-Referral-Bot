import express from "express";
import TelegramBot from "node-telegram-bot-api";
// Use environment variables for sensitive information

import { TOKEN, PORT, dbConnect, REFERRALLINK, BACKEND_URL, NODE_ENV } from './config.js';
import { handleReferral, handleUsername, handleReferralVerification, handleGetList, handleUserList } from "./game.js";

const token = TOKEN;

let bot;

if (NODE_ENV === 'production') {
  bot = new TelegramBot(token);
  // Set webhook to receive updates
  bot.setWebHook(BACKEND_URL + bot.token);
}
else {
  // Use local development environment variables
  // Create a bot that uses 'polling' to fetch new updates
  bot = new TelegramBot(token, { polling: true });
}

console.log('bot server started...');

// Command to invite members
bot.onText(/\/invitedmembers (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1]; // Get the username from the command
  const res = await handleUserList(username);
  // Logic to invite the member (this is a placeholder)
  // Note: Bots cannot directly invite users; they can only send messages.
  await bot.sendMessage(chatId, res.message);
});

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
        await handleReferralVerification(member);
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

// Connect to MongoDB database

dbConnect();

// Create an Express app

const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

// Start the server

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server running at http://${host}:${port}/`);
});

app.post("/" + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.status(200).send();
});