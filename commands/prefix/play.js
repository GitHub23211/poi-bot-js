const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const { joinVoiceChannel } = require('@discordjs/voice')

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
    
module.exports = { play }