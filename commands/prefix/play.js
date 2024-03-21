const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const { joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice')
const ytdl = require('play-dl')

/**
 * Play music from a given YouTube URL
 * @param message - Message passed from Event
 * @param options - Array with one element - URL of Youtube video
 */
const play = {
    data: new PrefixCommandBuilder()
            .setName('play')
            .setDescription('Play music from a YouTube link'),
    async execute(message, options) {
        const channel = message.member.voice.channel

        if(!channel) { await message.reply("Connect to a voice channel first!"); return }
        if(options.length === 0) { await message.reply('YouTube URL missing.'); return }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        })

        const videoInfo = await ytdl.video_info(options[0])
        const ytStream = await ytdl.stream_from_info(videoInfo, {quality: 0})
        .catch(async e => {
            console.error(`Stream Error\n${e.toString()}`)
            await message.reply('Invalid YouTube URL.')
        })

        const resource = createAudioResource(ytStream.stream, {
            inputType: ytStream.type
        })

        const player = createAudioPlayer({behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop
        }})

        connection.subscribe(player)
        player.play(resource)

        player.on('error', e => console.error(`Audio Player Error\n${e.toStrig()}`))
              .on(AudioPlayerStatus.Playing, async () => await message.reply(`Now Playing: ${videoInfo['video_details']['title']}`))
    }
}

    
module.exports = { play }