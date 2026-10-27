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
