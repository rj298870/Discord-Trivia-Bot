Trivia Bot

This is a Discord bot that hosts trivia in your server. You answer with buttons, earn points, and climb the leaderboard.

Try it

Invite link: [https://discord.com/oauth2/authorize?client_id=1563678203728371832&permissions=0&integration_type=0&scope=bot+applications.commands](url)

Demo server: [https://discord.gg/Kkm4HFsQa6](url)

Commands

/trivia:	Posts a random question with four answer buttons. Everyone gets one try, and the answer is revealed after 20 seconds.
/leaderboard:	Shows the top 10 players in the server.
/roll: Rolls a die.

Each correct trivia answer is worth 1 point. Scores are saved in a SQLite database, so they stay around when the bot restarts.

Permissions

The bot uses slash commands and buttons only, so it needs very little:
Scopes: bot and applications.commands
Bot permissions: none extra. Replies to slash commands and buttons don't need Send Messages.
Intents: only Guilds. It does not read message content.

Run your own copy:

You need Node.js 20 or newer.

First, go to the Discord Developer Portal at https://discord.com/developers/applications and make a new application. Copy the Application ID from General Information. Then go to the Bot tab, reset the token, and copy it.

Next, invite the bot to a test server. Go to OAuth2, then URL Generator, check bot and applications.commands, and open the link it makes.

Then download the code and install it by running these three commands:

git clone https://github.com/rj298870/Discord-Trivia-Bot.git

cd Discord-Trivia-Bot

npm install

Make a file called .env and put these three lines in it. GUILD_ID is optional. If you add it, the commands show up right away in that server.

DISCORD_TOKEN=your_bot_token

CLIENT_ID=your_application_id

GUILD_ID=your_test_server_id

Register the commands by running npm run deploy. You only do this once.

Then start the bot by running npm start.

The bot only works while it's running. I host mine on Hack Club Nest so it stays online.

Adding your own questions

Open questions.js and add a new one. The answer is the number of the right option, starting at 0.

Files

index.js is the bot. deploy-commands.js registers the slash commands. db.js saves the scores. questions.js has the questions.

Token warning

Your bot token is like a password. Keep it in .env and don't put it on GitHub. If it leaks, reset it in the Developer Portal.
