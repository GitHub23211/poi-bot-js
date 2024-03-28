const ytdl = require('play-dl')
const process = require('node:child_process')
const prism = require('prism-media')
const { createAudioResource } = require('@discordjs/voice')

class SongObject{
    constructor(url, filters) {
        this.url = url
        this.filters = filters
    }

    async getAudioInfo() { 
        const info = await ytdl.video_info(this.url)
        this.name = info.video_details.title
        this._audioURL = info.format.filter(
            f => f.itag === 251 ||
                 f.itag === 250 ||
                 f.itag === 249 ||
                 f.itag === 248
            )[0].url
    }

    async createSongResource() {
        const stream = process.spawn('ffmpeg', [
            '-i', this._audioURL,
            '-f', 's16le', 
            '-ar', '48000', 
            '-ac', '2', 
            '-af', 'bass=g=20',
            'pipe:1'
        ])
        
        const opus = stream.stdout.pipe(new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 }));
        const resource = createAudioResource(opus, {inputType: 'opus'})
        return resource
    }
}

module.exports = SongObject