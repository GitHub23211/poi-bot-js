const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const { createAudioResource, getVoiceConnection } = require('@discordjs/voice')

/**
 * Skip current song
 * @param message - Message passed from Event
 * @param options - Empty array; not used.
 */
const skip = {
    data: new PrefixCommandBuilder()
            .setName('skip')
            .setDescription('Skip current song'),
    async execute(message, options) {
        const connection = getVoiceConnection(message.guild.id)
        const client = message.client

        if(!connection) { await message.reply("I'm not currently in a voice channel!"); return }
        if(client.queue.length === 0) { await message.channel.send(`No more songs in queue.`); return}

        await message.channel.send(`Skipping ${client.song.name}...`)
        client.song = client.queue.shift()
        client.player.play(await client.song.createSongResource())
    }
}
    
module.exports = { skip }
