const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const SongObject = require('../../components/song-object.js')
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice')

/**
 * Play music from a given YouTube URL
 * @param message - Message passed from Event
 * @param options - Array with at least one element - URL of Youtube video
 * Any element after the URL video needs to be validated as a proper ffmpeg filter
 */
const play = {
    data: new PrefixCommandBuilder()
            .setName('play')
            .setDescription('Play music from a YouTube link')
            .setCooldown(1),
    async execute(message, options) {
        const channel = message.member.voice.channel
        const client = message.client

        if(!channel) { await message.reply("Connect to a voice channel first!"); return }
        if(options.length === 0) { await message.reply('YouTube URL missing.'); return }
        if(!await addQueue(message, options)) return
        if(client.isPlaying) { await message.channel.send(`Added ${client.queue[0].name} to the queue!`); return}

        const connection = getVoiceConnection(message.guild.id) ?? connectToChannel(channel)
        client.player ??= newAudioPlayer(client, message)
        client.song = client.queue.shift()
        client.player.play(await client.song.createSongResource())
        connection.subscribe(client.player)
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
        await message.channel.send(`Now Playing: ${client.song.name}.`)
        client.isPlaying = true
    })
    .on(AudioPlayerStatus.Idle, async () => {
        if(client.queue.length === 0) { 
            await message.channel.send('Queue finished.')
            client.isPlaying = false
            return
        }

        client.song = client.queue.shift()
        player.play(await client.song.createSongResource())
    })
    return player
}

async function addQueue(message, options) {
    try {
        const url = options[0]
        const filters = options.slice(1)
        const song = new SongObject(url, filters)
        // Need to find better way to invoke this function
        await song.getAudioInfo()
        message.client.queue.push(song)
        return true
    }
    catch (e) {
        console.error(`Stream Error\n${e.toString()}`)
        await message.reply('Invalid YouTube URL.')
        return false
    }
}

module.exports = { play }