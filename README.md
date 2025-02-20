# Simp Referral Bot

This Telegram bot, designed to run on Render, allows users to send referral links to their friends and track their success in bringing new members to your Telegram group. The bot also features a ranking system to showcase top referrers.

## Features

- Generate unique referral links for users
- Track successful referrals
- Display a leaderboard of top referrers
- Easy deployment on Render

## Installation

1. Clone this repository: <br />

   `git clone https://github.com/Ekans111/Simp-Referral-Bot.git` <br/>
   `cd Simp-Referral-Bot` <br/>
   
2. Install the required dependencies: <br />
  `npm install`

## Configuration

1. Create a `.env` file in the project root and add the following .env.example file.
2. Replace the placeholders with your actual values:
   - `your_telegram_bot_token`: Obtain this from [@BotFather](https://t.me/BotFather) on Telegram
   - `your_telegram_group_link`: The Link of the group you want users to join
   - `your_database_url`: Your MongoDB database URL

## Usage

To start the bot locally: <br />
   run `npm start`

## Deployment

This bot is designed to be deployed on Render. Follow these steps:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the environment variables in the Render dashboard
4. Deploy the bot

## Commands

- `/start`: Access the help menu
- `/myreferral`:Generate your unique referral link
- `/leaderboard`: View the top members who have invited friends to become group user

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[ekans111](https://t.me/Ecrypto_1)

## Live Bot

[@SimpReferralBot](https://t.me/SimpReferralBot)
