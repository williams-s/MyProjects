const {
  EmbedBuilder,
} = require("discord.js");
require("node-schedule");
require("unofficial-valorant-api");
require("fs");




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