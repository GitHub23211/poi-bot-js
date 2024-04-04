const process = require('node:child_process')
const ytdl = require('play-dl')
const prism = require('prism-media')
const { createAudioResource } = require('@discordjs/voice')
const FilterFactory = require('./filters/filter-factory')

module.exports =  class SongObject{
    constructor(url, filters, client) {
        this.url = url
        this.filters = filters
        this.client = client
    }

    async getAudioInfo() {
        this.info = await ytdl.video_info(this.url)
        this.name = this.info.video_details.title
        this.flags = this.parseFilters()

        //251 is the lowest quality since non-boosted servers only get up to 96kpbs audio bitrate
        //Look for other opus formats from lowest to highest just in case
        this._audioURL = this.info.format.filter(
            f => f.itag === 251 || 
                 f.itag === 250 || 
                 f.itag === 249 ||
                 f.itag === 248
            )[0].url
    }

    parseFilters() {
        if(!this.filters || this.filters.length <= 0) return null

        const flags = []
        try {
            this.filters.forEach(filter => {
                const split = filter.split('=')
                const filterName = split[0].toLowerCase()
                const value = split[1]
                flags.push(FilterFactory.build(filterName, value))
            })
            return ['-af', flags.join(',')]
        }
        catch (e) {
            throw e
        }
    }

    async createSongResource() {
        if(!this.flags) {
            const stream = await ytdl.stream_from_info(this.info, {quality: 0})
            const resource = createAudioResource(stream.stream, {inputType: stream.type})
            return resource
        }

        this.client.stream?.kill()
        this.client.stream = this.createStream()
        const opus = stream.stdout.pipe(new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 }));
        const resource = createAudioResource(opus, {inputType: 'opus'})
        return resource
    }

    createStream() {
        const stream = process.spawn('ffmpeg', 
            [
                '-reconnect', '1',
                '-reconnect_streamed', '1',
                '-reconnect_delay_max', '2',
                '-hide_banner',
                '-i', this._audioURL,
                '-f', 's16le', 
                '-ar', '48000', 
                '-ac', '2', 
            ].concat(this.flags)
            .concat('pipe:1')
        )
        return stream
    }
}