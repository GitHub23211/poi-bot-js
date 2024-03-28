const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')
const { getVoiceConnection, joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice')
const ytdl = require('play-dl')
const process = require('node:child_process')
const prism = require('prism-media')

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

        client.song = createResource(client.queue.shift()[1])
        client.player.play(client.song)
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
        //await message.channel.send(`Now Playing: ${client.song[0]}.`)
        client.isPlaying = true
    })
    .on(AudioPlayerStatus.Idle, async () => {
        if(client.queue.length === 0) { 
            await message.channel.send('Queue finished.')
            client.isPlaying = false
            return
        }
        // client.song = client.queue.shift()
        // player.play(
        //     createAudioResource(client.song[1].stream, {
        //         inputType: client.song[1].type
        //     })
        // )
    })
    return player
}

async function addQueue(message, url) {
    try {
        const client = message.client
        const info = await ytdl.video_info(url)
        client.queue.push(['test', info.format.filter(f => f.itag === 251)[0].url])
        return true
    }
    catch (e) {
        console.error(`Stream Error\n${e.toString()}`)
        await message.reply('Invalid YouTube URL.')
        return false
    }
}

function createResource(url) {
    const stream = process.spawn('ffmpeg', [
        '-i', url,
        '-f', 's16le', 
        '-ar', '48000', 
        '-ac', '2', 
        '-ab', '320',
        '-af', 'bass=g=20',
        'pipe:1'
    ])
    
    const opus = stream.stdout.pipe(new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 }));
    const resource = createAudioResource(opus, {inputType: 'opus'})
    return resource
}

module.exports = { play }