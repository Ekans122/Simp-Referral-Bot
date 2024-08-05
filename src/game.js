const fs = require('fs'); // Import the File System module

async function handleUsername(bot, chatId, userId, username) {
  const buttons = [
    [
      {
        text: 'Start',
        web_app: { url: 'https://tma-nomad.vercel.app/' },
      },
    ],
    // [{ text: 'Go to Go! AI-RPG', url: 'https://ton.app/social/go!-app?id=1349' }],
    // [{ text: 'X(Twitter)', url: 'https://x.com/gorwachain' }],
    // [{ text: 'Telegram', url: 'https://t.me/gorwachain' }],
    // [{ text: 'Discord', url: 'https://discord.com/gorwachain' }],
    // [{ text: 'Website', url: 'https://www.goplatform.io/' }],
  ];
  const rocketEmoji = '\uD83D\uDE80'; // 🚀
  const eyesEmoji = '\uD83D\uDC40'; // 👀
  const playGuitarEmoji = '\uD83C\uDFB8'; // 🎸
  const gemEmoji = '\uD83D\uDC8E'; // 💎
  const giftEmoji = '\uD83C\uDF81'; // 🎁
  const welcomeText = `Welcome to our Nomad Mini App! ${username}\n
What can this bot do?\n
${eyesEmoji} Click Start below\n
${playGuitarEmoji} Play the guitar! token to collect rewards\n
${giftEmoji} Complete social tasks and invite friends for more rewards\n
Nomad is your gateway to rewards and adventures! ${rocketEmoji}`;

  // // First, send the welcome image
  const localImagePath = 'https://res.cloudinary.com/dz6r3o4w0/image/upload/v1718722487/guitar_hfpzls.jpg'; // Replace with the local path to your image
  // const imageData = fs.readFileSync(localImagePath);
  const originalFilename = localImagePath.split('/').pop();

  await bot.sendPhoto(
    chatId,
    localImagePath,
    {
      caption: welcomeText,
      filename: originalFilename,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: buttons,
      },
    }
  );

  // // Then, send the welcome text with buttons
  // await bot.sendMessage(chatId, welcomeText, {
  //   parse_mode: 'HTML',
  //   reply_markup: {
  //     inline_keyboard: buttons,
  //   }
  // });
}



module.exports = {
  handleUsername,
};
