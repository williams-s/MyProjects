const { rankIndex } = require("./ranksValo.js");
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  EmbedBuilder,
} = require("discord.js");
const schedule = require("node-schedule");
const HenrikDevValorantAPI = require("unofficial-valorant-api");
const fs = require("fs");
const yaml = require("js-yaml");




function sendEmbed(color, title, description, fields, boolTimestamp) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description);
  if (fields) {
    embed.addFields(fields);
  }
  if (boolTimestamp) {
    embed.setTimestamp();
  }
  return embed;
}

function wrongChannelMsg(title, description) {
  return sendEmbed("#ff0000", title, description, null, true);
}

module.exports = { sendEmbed, wrongChannelMsg }; //sendEmbed, wrongChannelMsg