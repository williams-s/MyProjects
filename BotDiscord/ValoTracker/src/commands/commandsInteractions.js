const {setLang} = require("../languages/translate");
const {sendEmbed, wrongChannelMsg} = require("../utils/sendEmbed");
const {insertPlayer} = require("../players/addPlayer");
const {EmbedBuilder} = require("discord.js");
const {deletePlayer} = require("../players/deletePlayer");
const {sortList} = require("../utils/sortList");
const {updateDiscordId} = require("../discord/updateDiscordId");
const {addDiscordId} = require("../discord/addDiscordId");
const {getAccount} = require("../players/getAccount");
const {updateLang} = require("../languages/updateLanguage");
const {capitalizeFirstLetter} = require("../utils/firstLetterUppercase");

async function wrongChannel(guild_id,client,myLanguageWords,allGuilds) {
    if (!allGuilds[guild_id]) {
        return (wrongChannelMsg("Error","No channel setup !"));
    }
    let good_channel = await client.channels.fetch(allGuilds[guild_id].channel_id);
    await setLang(allGuilds[guild_id].lang,myLanguageWords);
    return (wrongChannelMsg(myLanguageWords.errorTitle,`${myLanguageWords.wrongChannel} \n ${myLanguageWords.goodChannel} : ${good_channel}`));
}


const initCommands = async (client, myLanguageWords, allGuilds, allDiscords, listPlayersByChannel,VAPI,playersList) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        let channel_id = interaction.channel.id;
        let guild_id = interaction.channel.guildId;

        if(interaction.commandName === "help") {
            await interaction.deferReply({ ephemeral: false });
            if (!allGuilds[guild_id]) {
                await setLang("en",myLanguageWords);
            }
            else {
                await setLang(allGuilds[guild_id].lang,myLanguageWords);
            }
            let embed =  sendEmbed(0x0099ff, myLanguageWords.helpTitle, myLanguageWords.helpDescription, null, true);
            interaction.editReply({embeds : [embed]});
        }

        if (interaction.commandName === "allcommands"){
            await interaction.deferReply({ ephemeral: false });
            if (!allDiscords[channel_id]) {
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
                return;
            }
            await setLang(allDiscords[channel_id].lang,myLanguageWords);
            let embed =  sendEmbed(0x0099ff, myLanguageWords.allcommandsTitle, myLanguageWords.allcommandsDescription, null, true);
            interaction.editReply({embeds : [embed]});
        }
        if (interaction.commandName === "add-player") {
            await interaction.deferReply({ ephemeral: false });
            let channel_id = interaction.channel.id;
            let guild_id = interaction.channel.guildId;
            if (!allDiscords[channel_id]) {
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
                return;
            }
            await setLang(allDiscords[channel_id].lang,myLanguageWords);
            try {
                const nameValue = interaction.options.getString('name');
                const tagValue = interaction.options.getString('tag');
                const added = await insertPlayer(nameValue, tagValue, guild_id, channel_id,VAPI,playersList,listPlayersByChannel,allDiscords);
                //console.log("dzaopazk " + added);
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(myLanguageWords.addPlayerTitle)
                    .setDescription(`${capitalizeFirstLetter(nameValue)}#${tagValue} ${myLanguageWords.addPlayerDescription}`)
                    .setTimestamp();
                if (added == true) {
                    interaction.followUp({ embeds: [embed] });
                }else {
                    if (added == -2) {
                        embed.setTitle(myLanguageWords.playerNotFoundTitle)
                        embed.setDescription(`${nameValue}#${tagValue} ${myLanguageWords.playerNotFoundDescription}`)
                        interaction.followUp({embeds: [embed]});
                    } else {
                        embed.setTitle('Erreur')
                        embed.setDescription(`${nameValue}#${tagValue} ${myLanguageWords.addPlayerError}`)
                        interaction.followUp({embeds: [embed]});
                    }
                }
            } catch (error) {
                interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
            }
        }

        if (interaction.commandName === "remove-player") {
            await interaction.deferReply({ ephemeral: false });
            let channel_id = interaction.channel.id;
            let guild_id = interaction.channel.guildId;
            if (!allDiscords[channel_id]) {
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
                return;
            }
            await setLang(allDiscords[channel_id].lang,myLanguageWords);
            try {
                const nameValue = interaction.options.getString('name');
                const tagValue = interaction.options.getString('tag');
                const deleted = await deletePlayer(nameValue, tagValue,channel_id, allDiscords, playersList,listPlayersByChannel);
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(myLanguageWords.removePlayerTitle)
                    .setDescription(`${nameValue}#${tagValue} ${myLanguageWords.removePlayerDescription}`)
                    .setTimestamp();
                //console.log("dzaopazk " + deleted);
                if (deleted == true) {
                    interaction.followUp({ embeds: [embed] });
                    listPlayersByChannel[channel_id] = listPlayersByChannel[channel_id].filter(player => player.name !== nameValue && player.tag !== tagValue && player.channel_id !== channel_id);
                }
                else {
                    embed.setDescription(`${nameValue}#${tagValue} ${myLanguageWords.removePlayerError}`)
                    interaction.followUp({ embeds: [embed] });
                }
            } catch (error) {
                interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
            }
        }

        if (interaction.commandName === "leaderboard") {
            await interaction.deferReply({ ephemeral: false });
            let guild_id = interaction.channel.guildId;
            let channel_id = interaction.channel.id;
            if(allDiscords[channel_id]) {
                await setLang(allDiscords[channel_id].lang,myLanguageWords);
                try {
                    let leaderboard = listPlayersByChannel[interaction.channel.id];
                    /*       if (leaderboard) {console.log(leaderboard);}
                          else{console.log("no leaderboard")} */
                    //console.log(leaderboard);
                    let description = "";
                    if (leaderboard === undefined || leaderboard.length === 0) {
                        let embed = sendEmbed(0x0099ff, myLanguageWords.leaderboardTitle, myLanguageWords.leaderboardError, null, true);
                        interaction.editReply({embeds : [embed]});
                        return;
                    }
                    else {
                        await sortList(leaderboard);
                    }
                    for(let i = 0; i < leaderboard.length; i++) {
                        let player = leaderboard[i];
                        description += `${i+1}. ${capitalizeFirstLetter(player.name)}#${player.tag.toUpperCase()} - ${player.tier} ${player.rr}rr\n`;
                    }
                    const embed = new EmbedBuilder()
                        .setColor(0x0099ff)
                        .setTitle(myLanguageWords.leaderboardTitle)
                        .setDescription(description)
                        .setTimestamp();
                    interaction.followUp({ embeds: [embed] });
                } catch (error) {
                    interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
                }
            }else{
                //let good_channel = await client.channels.fetch(allGuilds[guild_id].channel_id);
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
            }
        }
        if (interaction.commandName === "init") {
            await interaction.deferReply({ ephemeral: false });
            let guild_id = interaction.channel.guildId;
            let channel_id = interaction.channel.id;
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTimestamp();
            if(allGuilds[guild_id]){
                let past_channel_id = allGuilds[guild_id].channel_id;
                let updateValue = await updateDiscordId(guild_id,channel_id,allGuilds,allDiscords);
                //console.log(updateValue);
                if (updateValue === true){
                    if(past_channel_id != channel_id){
                        if (listPlayersByChannel[past_channel_id]) {
                            listPlayersByChannel[channel_id] = listPlayersByChannel[past_channel_id];
                            for (let i = 0; i < listPlayersByChannel[channel_id].length; i++) {
                                listPlayersByChannel[channel_id][i].channel_id = channel_id;
                            }
                            delete listPlayersByChannel[past_channel_id];
                            delete allDiscords[past_channel_id];
                        } else {
                            console.error(`Aucun joueur trouvé dans le canal ${past_channel_id}`);
                        }
                        await setLang(allGuilds[guild_id].lang,myLanguageWords);
                        embed.setTitle(myLanguageWords.initTitle)
                        embed.setDescription(myLanguageWords.initDescription);
                        interaction.followUp({ embeds: [embed] });
                    } else {
                        await setLang(allGuilds[guild_id].lang,myLanguageWords);
                        embed.setTitle(myLanguageWords.initTitle)
                        embed.setDescription(myLanguageWords.initSameChannel)
                        interaction.followUp({ embeds: [embed] });
                        return;
                    }
                } else {
                    console.error("error");
                }
            }else{
                await setLang("en",myLanguageWords);
                let addDiscordBool = await addDiscordId(guild_id,channel_id,allGuilds,allDiscords);
                //console.log(addDiscordBool," addDiscordBool ",addDiscordBool);
                if (addDiscordBool == true){
                    try {
                        //console.log(myLanguageWords.initTitle);
                        const embed = new EmbedBuilder()
                            .setColor(0x0099ff)
                            .setTitle(myLanguageWords.initTitle)
                            .setDescription(myLanguageWords.initDescription)
                            .setTimestamp();
                        interaction.followUp({ embeds: [embed] });
                    } catch (error) {
                        interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
                    }
                }else{
                    /*         const embed = new EmbedBuilder()
                              .setColor(0x0099ff)
                              .setTitle(myLanguageWords.initTitle)
                              .setDescription(`${myLanguageWords.initError} hint : use /unbind to setup a new channel`)
                              .setTimestamp();
                            interaction.followUp({ embeds: [embed] }); */
                }
            }
        }
        if (interaction.commandName === "en") {
            await interaction.deferReply({ ephemeral: false });

            if (!allDiscords[channel_id]) {
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
                return;
            }
            if (await updateLang("en",interaction.channel.guildId,interaction.channel.id,allGuilds,allDiscords)){
                await setLang("en",myLanguageWords);
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Language changed to English")
                    .setDescription("The language has been changed to English")
                    .setTimestamp();
                interaction.followUp({ embeds: [embed] });
            }else{
                interaction.editReply({ content: `An error occurred:`});
            }
        }
        if (interaction.commandName === "fr") {
            await interaction.deferReply({ ephemeral: false });
            if (!allDiscords[channel_id]) {
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
                return;
            }
            if (await updateLang("French",interaction.channel.guildId,interaction.channel.id,allGuilds,allDiscords)){
                await setLang("French",myLanguageWords);
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("La langue a été changée en Français")
                    .setDescription("La langue a été changée en Français")
                    .setTimestamp();
                interaction.followUp({ embeds: [embed] });
            }else{
                interaction.editReply({ content: `An error occurred:` });
            }
        }
        if (interaction.commandName === "es") {
            await interaction.deferReply({ ephemeral: false });
            if (!allDiscords[channel_id]) {
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
                return;
            }
            if (await updateLang("es",interaction.channel.guildId,interaction.channel.id,allGuilds,allDiscords)){
                await setLang("es",myLanguageWords);
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Idioma cambiado a Español")
                    .setDescription("El idioma ha cambiado a Español")
                    .setTimestamp();
                interaction.followUp({ embeds: [embed] });
            }else{
                interaction.editReply({ content: `An error occurred:` });
            }
        }
        if (interaction.commandName === "de") {
            await interaction.deferReply({ ephemeral: false });
            if (!allDiscords[channel_id]) {
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
                return;
            }
            if (await updateLang("de", interaction.channel.guildId, interaction.channel.id,allGuilds,allDiscords)){
                await setLang("de",myLanguageWords);
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Sprache geändert auf Deutsch")
                    .setDescription("Die Sprache wurde auf Deutsch geändert")
                    .setTimestamp();
                interaction.followUp({ embeds: [embed] });
            }else{
                interaction.editReply({ content: `An error occurred:` });
            }
        }

        if (interaction.commandName === "profile") {
            await interaction.deferReply({ ephemeral: false });
            let channel_id = interaction.channel.id;
            let guild_id = interaction.channel.guildId;
            if (!allDiscords[channel_id]) {
                let embed = await wrongChannel(guild_id,client,myLanguageWords,allGuilds);
                interaction.editReply({embeds : [embed]});
                return;
            }
            await setLang(allDiscords[channel_id].lang,myLanguageWords);
            let name = interaction.options.getString("name");
            let tag = interaction.options.getString("tag");
            let embed = await getAccount(name,tag,VAPI,myLanguageWords);
            if (embed === null) {
                embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(`${myLanguageWords.playerNotFoundTitle}`)
                    .setDescription(`${name}#${tag} ${myLanguageWords.playerNotFoundDescription} `)
            }
            interaction.followUp({ embeds: [embed] });
        }

    });

}

module.exports = {
    initCommands
};