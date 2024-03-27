const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const { getVoiceConnection, joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice')
const ytdl = require('play-dl')

/**
 * Play music from a given YouTube URL
 * @param message - Message passed from Event
 * @param options - Array with one element - URL of Youtube video
 */
const play = {
    data: new PrefixCommandBuilder()
            .setName('play')
            .setDescription('Play music from a YouTube link')
            .setCooldown(3),
    async execute(message, options) {
        const channel = message.member.voice.channel
        const client = message.client

        if(!channel) { await message.reply("Connect to a voice channel first!"); return }
        if(options.length === 0) { await message.reply('YouTube URL missing.'); return }

        if(!await addQueue(message, options[0])) return

        if(client.isPlaying) { await message.channel.send(`Added ${client.queue[0][0]} to the queue!`); return}

        const connection = getVoiceConnection(message.guild.id) ?? connectToChannel(channel)
        client.player ??= newAudioPlayer(client, message)
        connection.subscribe(client.player)

        if(client.queue.length === 0) { await message.reply('No songs in queue.'); return }

        client.song = client.queue.shift()
        client.player.play(
            createAudioResource(client.song[1].stream, {
                inputType: client.song[1].type
            })
        )
    }
}

function connectToChannel(channel) {
    return joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })
}

function newAudioPlayer(client, message) {
    const player = createAudioPlayer({behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop
    }})

    player
    .on('error', e => console.error(`Audio Player Error\n${e.toString()}`))
    .on(AudioPlayerStatus.Playing, async () => {
        await message.channel.send(`Now Playing: ${client.song[0]}.`)
        client.isPlaying = true
    })
    .on(AudioPlayerStatus.Idle, async () => {
        if(client.queue.length === 0) { 
            await message.channel.send('Queue finished.')
            client.isPlaying = false
            return
        }
        client.song = client.queue.shift()
        player.play(
            createAudioResource(client.song[1].stream, {
                inputType: client.song[1].type
            })
        )
    })
    return player
}

async function addQueue(message, url) {
    try {
        const client = message.client
        const videoInfo = await ytdl.video_info(url)
        const ytStream = await ytdl.stream_from_info(videoInfo, {quality: 0})
        client.queue.push([videoInfo['video_details']['title'], ytStream])
        return true
    }
    catch (e) {
        console.error(`Stream Error\n${e.toString()}`)
        await message.reply('Invalid YouTube URL.')
        return false
    }
}

module.exports = { play }