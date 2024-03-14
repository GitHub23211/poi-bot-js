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
        const channel = message.member.voice.channel
        if(!channel) {
            message.reply("I'm not currently in a voice channel!")
            return
        }
        const connection = getVoiceConnection(channel.guild.id)
        if(!connection) {
            message.reply("I'm not currently in a voice channel!")
            return
        }
        connection.destroy()
        message.reply("Leaving VC")
    }
}
    
module.exports = { stop }
