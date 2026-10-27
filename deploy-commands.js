import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
    console.error("Missing DISCORD_TOKEN or CLIENT_ID. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a die")
    .addIntegerOption((o) =>
      o
        .setName("sides")
        .setDescription("How many sides? (default 6)")
        .setMinValue(2)
        .setMaxValue(1000),
    ),
  new SlashCommandBuilder().setName("trivia").setDescription("Ask a trivia question"),
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the top trivia players in this server"),
].map((c) => c.setDMPermission(false).toJSON());

const rest = new REST().setToken(DISCORD_TOKEN);

try {
  if (GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log(`Registered ${commands.length} commands in guild ${GUILD_ID}.`);
  } else {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands});
     console.log(`Registered ${commands.length} global commands.`);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}
