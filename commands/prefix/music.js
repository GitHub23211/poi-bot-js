const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice')

const play = {
    data: new PrefixCommandBuilder()
            .setName('play')
            .setDescription('Play music from a YouTube link'),
    async execute(message) {
        const channel = message.member.voice.channel
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        message.reply("yes")
    }
}

const stop = {
    data: new PrefixCommandBuilder()
            .setName('stop')
            .setDescription('Disconnects bot from voice channel'),
    async execute(message) {
        getVoiceConnection(message.member.voice.channel.guild.id).destroy()
    }
}
    
module.exports = {
    play,
    stop
}
