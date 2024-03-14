const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice')

const play = {
    data: new PrefixCommandBuilder()
            .setName('play')
            .setDescription('Play music from a YouTube link'),
    async execute(message) {
        const channel = message.member.voice.channel
        if(!channel) {
            message.reply("Connect to a voice channel first!")
            return
        }
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        message.reply("Playing music")
    }
}

const stop = {
    data: new PrefixCommandBuilder()
            .setName('stop')
            .setDescription('Disconnects bot from voice channel'),
    async execute(message) {
        const channel = message.member.voice.channel
        if(!channel) {
            message.reply("Connect to a voice channel first!")
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
    
module.exports = {
    play,
    stop
}
