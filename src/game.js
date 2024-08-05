import User from './model/UserInfo.js';
import { GROUPLINK } from './config.js';
export const handleUsername = async (bot, chatId, userId, username) => {
  const rocketEmoji = '\uD83D\uDE80'; // 🚀
  const eyesEmoji = '\uD83D\uDC40'; // 👀
  const playGuitarEmoji = '\uD83C\uDFB8'; // 🎸
  const giftEmoji = '\uD83C\uDF81'; // 🎁
  const welcomeText = `Welcome to our Simp Gods! ${username}\n
What can this bot do?\n
${eyesEmoji} Click Start below\n
${playGuitarEmoji} Invite your friends!\n
${giftEmoji} Invite More and More friends for more rewards\n
Simp is your gateway to rewards and adventures! ${rocketEmoji}\n
Please enter /myreferral to get your referral link`;
  console.log(userId);

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

export const handleReferral = async (username, userId, referralCode) => {
  const callbackData = 'join_group';
  const rocketEmoji = '\uD83D\uDE80'; // 🚀
  const gemEmoji = '\uD83D\uDC8E'; // 💎
  const giftEmoji = '\uD83C\uDF81'; // 🎁
  const inviteText = `Welcome to our Simp Gods! ${username}\n
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
  const { id, username } = member;
  console.log("User referred: ", member);
  const user = await User.findOne({ referralCode: id });
  if (!user) return { status: 'error', message: `Welcome to our Simp Gods! ${username}` };

  const referralUser = await User.findOne({ referralCode: user.referredBy });
  if (!referralUser) return { status: 'error', message: `Welcome to our Simp Gods! ${username}` };
  referralUser.friends.push(id);
  referralUser.referralCount ++;
  referralUser.lastReferralDate = new Date();
  await referralUser.save();

  console.log("User referred: ", referralUser);
  return { status: 'success', message: `Welcome to our Simp Gods! ${username}`, options: {} };
}
