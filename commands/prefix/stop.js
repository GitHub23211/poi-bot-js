const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const { getVoiceConnection } = require('@discordjs/voice')

/**
 * Disconnect bot from current voice channel
 * @param message - Message passed from Event
 * @param options - Empty array; not used.
 */
const stop = {
    data: new PrefixCommandBuilder()
            .setName('stop')
            .setDescription('Disconnects bot from voice channel'),
    async execute(message, options) {
        const connection = getVoiceConnection(message.guild.id)
        if(!connection) {
            await message.reply("I'm not currently in a voice channel!")
            return
        }
        connection.destroy()
        await message.reply("Leaving VC")
    }
}
    
module.exports = { stop }
