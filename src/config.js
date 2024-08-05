require('dotenv').config();

module.exports = {
  TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  BACKEND_URL: process.env.BACKEND_URL
};