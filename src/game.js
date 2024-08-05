import User from './model/UserInfo.js';
import { GROUPLINK } from './config.js';

export const handleUsername = async (bot, chatId, userId, username) => {
  const rocketEmoji = '\uD83D\uDE80'; // 🚀
  const eyesEmoji = '\uD83D\uDC40'; // 👀
  const playGuitarEmoji = '\uD83C\uDFB8'; // 🎸
  const giftEmoji = '\uD83C\uDF81'; // 🎁
  const welcomeText = `Welcome to Simp Gods Referral Program!

>> COMMANDS:

1️⃣ [ /start ] - help menu.
2️⃣ [ /myreferral ] - generate your own unique referral link.
3️⃣ [ /leaderboard ] - view the list of all members who have invited their friends to become Simp Gods!

>> AIRDROP REWARD RULES:

📱 Use your own uniquely generated referral link and share it with your friends!
🚀 TOP 20 members in the Leaderboards will share $5,000 in $SIMPG Tokens for FREE!
⏳ This FREE airdrop has a Limited Time pre-launch, be quick and invite as many friends as you can!

>> IT'S FUN BEING A SIMP GOD:

🌹 You can simp for Madison Beer https://simpgods.wtf/ai like a true Simp God!
🤳 Share screenshots on your X profile of you simping and tag #simpgodswtf for secret rewards!`;

  const user = await User.findOne({ referralCode: userId });
  if (!user) {
    await User.create({ referralCode: userId, username });
  }
  const buttons = []
  // // First, send the welcome image
  const localImagePath = 'https://res.cloudinary.com/danpc9k2a/image/upload/v1722868745/IMG_5974_pprt7m.gif'; // Replace with the local path to your image
  // const imageData = fs.readFileSync(localImagePath);
  const originalFilename = localImagePath.split('/').pop();

  await bot.sendAnimation(
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

  // await bot.sendMessage(chatId, welcomeText)
  // // Then, send the welcome text with buttons
  // await bot.sendMessage(chatId, welcomeText, {
  //   parse_mode: 'HTML',
  //   reply_markup: {
  //     inline_keyboard: buttons,
  //   }
  // });
}

export const handleReferral = async (username, userId, referralCode) => {
  const callbackData = 'join_group';
  const rocketEmoji = '\uD83D\uDE80'; // 🚀
  const gemEmoji = '\uD83D\uDC8E'; // 💎
  const giftEmoji = '\uD83C\uDF81'; // 🎁
  const inviteText = `Welcome to our Simp Gods! <${username}>\n
      ${giftEmoji} You are invited to our Simp Gods!${giftEmoji}\n
      ${gemEmoji}${gemEmoji}${gemEmoji} Join our Group and Enjoy!!!\n
      Simp is your gateway to rewards and adventures! ${rocketEmoji}\n`;
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'Join Group',
            url: GROUPLINK, // Your group invite link
            callback_data: callbackData
          }
        ]
      ]
    })
  };
  try {
    if (!referralCode) return { status: 'error', message: 'No referral code provided' };
    if (referralCode === userId) return { status: 'error', message: 'Referral code isn\'t the same as the user ID' };
    const updatedUser = await User.findOneAndUpdate({ referralCode: userId }, { username, referredBy: referralCode }, { new: true, upsert: true });
    console.log("User referred: ", updatedUser);
    const referralUser = await User.findOne({ referralCode: referralCode });
    if (!referralUser) {
      const createdReferralUser = await User.create({ referralCode });
      console.log("Referral user created: ", createdReferralUser);
    } else console.log("Referral user already exists: ", referralUser);
    return { status: 'success', message: inviteText, options: options };

  } catch (err) {
    console.error(err);
    return { status: 'error', message: 'Failed to handle referral' };
  }
}

/*
  Handle referral verification from Telegram's callback_query event.
  This is called when a user clicks the 'Join Group' button in the welcome message.
  New member: {
    id: 6534869982,
    is_bot: false,
    first_name: 'Tween',
    username: 'Lovelyroy1106',
    language_code: 'en'
  }
*/

export const handleReferralVerification = async (member) => {
  const { id, username, is_bot } = member;
  console.log("User referred: ", member);
  if (is_bot) return { status: 'error', message: `Welcome to our Simp Gods! <${username}>` };
  const user = await User.findOne({ referralCode: id });
  if (!user) return { status: 'error', message: `Welcome to our Simp Gods! <${username}>` };

  const referralUser = await User.findOne({ referralCode: user.referredBy });
  if (!referralUser) return { status: 'error', message: `Welcome to our Simp Gods! <${username}>` };
  referralUser.friends.push({ id, username });
  referralUser.referralCount++;
  referralUser.lastReferralDate = new Date();
  await referralUser.save();

  console.log("User referred: ", referralUser);
  return { status: 'success', message: `Welcome to our Simp Gods! <${username}>`, options: {} };
}

export const handleGetList = async () => {
  const users = await User.find({ friends: { $ne: [] } });
  if (!users) return { status: 'error', message: 'No referral list' };
  let message = `Referral List of Users:\n`;
  users.sort((a, b) => b.referralCount - a.referralCount);
  users.forEach(user => {
    if (!user.referralCount) return;
    message += `- (${user.referralCount}) ${user.username}\n`;
  });
  return { status: 'success', message: message };
}
