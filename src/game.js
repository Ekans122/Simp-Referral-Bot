async function handleUsername(bot, chatId, userId, username) {
  const rocketEmoji = '\uD83D\uDE80'; // 🚀
  const eyesEmoji = '\uD83D\uDC40'; // 👀
  const playGuitarEmoji = '\uD83C\uDFB8'; // 🎸
  const gemEmoji = '\uD83D\uDC8E'; // 💎
  const giftEmoji = '\uD83C\uDF81'; // 🎁
  const welcomeText = `Welcome to our Simp Gods! ${username}\n
What can this bot do?\n
${eyesEmoji} Click Start below\n
${playGuitarEmoji} Invite your friends!\n
${giftEmoji} Invite More and More friends for more rewards\n
Simp is your gateway to rewards and adventures! ${rocketEmoji}\n
Please enter /myreferral to get your referral link`;

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



export { handleUsername };
