function removeDiscordId(channel_id, guild_id) {
    fetch(discordInfosUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            guild_id: guild_id,
            channel_id: null
        }),
    })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            delete allDiscords[channel_id];
            allGuilds[guild_id].channel_id = null;
            return data;
        })
        .catch(error => {
            //console.error(error);
            return false;
        });
}