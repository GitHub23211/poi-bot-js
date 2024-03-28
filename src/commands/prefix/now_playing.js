const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')

/**
 * Messages currently playing song
 * @param message - Message passed from Event
 * @param options - Empty array; not used.
 */
const np = {
    data: new PrefixCommandBuilder()
            .setName('np')
            .setDescription('Messages currently playing song'),
    async execute(message, options) {
        if(!message.client.song) { await message.reply('No song currently playing.'); return}
        await message.channel.send(`Currently playing: ${message.client.song.name}`)
    }
}
    
module.exports = { np }
