import "dotenv/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    GatewayIntentBits,
    MessageFlags,
} from "discord.js";
import { questions } from "./questions.js";
import { addPoint, getTop } from "./db.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const ROUND_MS = 20_000;
const LETTERS = ["A", "B", "C", "D"];

const active = new Map();

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] =[a[j], a[i]];
    }
    return a;
}

function buildButtons(state, reveal = false) {
   const row = new ActionRowBuilder();
   state.order.forEach((optIdx, position) => {
    let style = ButtonStyle.Primary;
    if (reveal) {
        style = optIdx === state.q.answer ? ButtonStyle.Success : ButtonStyle.Secondary;
    }
    row.addComponents(
        new ButtonBuilder()
        .setCustomId(`trivia:${optIdx}`)
        .setLabel(`${LETTERS[position]}: ${state.q.options[optIdx]}`)
        .setStyle(style)
        .setDisabled(reveal),
    );
   });
   return row;
}

function questionEmbed(q, footer) {
    return new EmbedBuilder()
    .setTitle("Trivia time!")
    .setDescription(q.question)
    .setFooter({ text: footer })
    .setColor(0x5865f2);
}

async function handleRoll(interaction) {
    const sides = interaction.options.getInteger("sides") ?? 6;
    const n = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`You rolled a **${n}** (d${sides})!`);
}

async function handleTrivia(interaction) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  const state = {
    q,
    order: shuffle(q.options.map((_, i) => i)),
    answered: new Set(),
    winners: new Set(),
  };

  const message = await interaction.reply({
    embeds: [questionEmbed(q, `Everyone gets one try. You have ${ROUND_MS / 1000} seconds.`)],
     components: [buildButtons(state)],
    fetchReply: true,
  });
  active.set(message.id, state);

  setTimeout(async () => {
    active.delete(message.id);
    const answer = q.options[q.answer];
    const winners = [...state.winners];
    const result = winners.length
      ? `Got it right: ${winners.map((id) => `<@${id}>`).join(", ")}`
      : "Nobody got it this time.";
    try {
      await interaction.editReply({
        embeds: [
          questionEmbed(q, "Round over!").setDescription(
            `${q.question}\n\nThe answer was **${answer}**.\n${result}`,
          ),
        ],
        components: [buildButtons(state, true)],
      });
    } catch (err) {
      console.error("Could not edit trivia message:", err);
    }
  }, ROUND_MS);
}

async function handleLeaderboard(interaction) {
    const top = getTop(interaction.guildId, 10);
    if (top.length === 0) {
        await interaction.reply("No scores yet. Try `/trivia` to get on the board!");
        return;
    }
    const lines = top.map((row, i) => `**${i + 1}.** <@${row.user_id}> - ${row.points} pts`);
  const embed = new EmbedBuilder()
    .setTitle("Trivia leaderboard")
    .setDescription(lines.join("\n"))
    .setColor(0xfee75c);
  await interaction.reply({ embeds: [embed], allowedMentions: { parse: [] } });
}

async function handleButton(interaction) {
    const state = active.get(interaction.message.id);
    const ephemeral = MessageFlags.Ephemeral;

   if (!state) {
    await interaction.reply({ content: "This round is already over.", flags: ephemeral });
    return;
  }
  if (state.answered.has(interaction.user.id)) {
    await interaction.reply({ content: "You already answered this one!", flags: ephemeral });
    return;
  }
  state.answered.add(interaction.user.id);

  const picked = Number(interaction.customId.split(":")[1]);
   if (picked === state.q.answer) {
    state.winners.add(interaction.user.id);
    addPoint(interaction.guildId, interaction.user.id);
    await interaction.reply({ content: "Correct! +1 point.", flags: ephemeral });
  } else {
    await interaction.reply({ content: "Nope, not that one. Wait for the reveal!", flags: ephemeral });
  }
}

client.once("clientReady", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "roll") return await handleRoll(interaction);
      if (interaction.commandName === "trivia") return await handleTrivia(interaction);
      if (interaction.commandName === "leaderboard") return await handleLeaderboard(interaction);
    } else if (interaction.isButton() && interaction.customId.startsWith("trivia:")) {
      return await handleButton(interaction);
    }
  } catch (err) {
    console.error(err);
    const msg = { content: "Something went wrong, sorry!", flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {});
    else await interaction.reply(msg).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
