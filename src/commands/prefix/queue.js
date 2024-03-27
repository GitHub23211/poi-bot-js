const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')

/**
 * Check song queue
 * @param message - Message passed from Event
 * @param options - Empty array; not used.
 */
const queue = {
    data: new PrefixCommandBuilder()
            .setName('queue')
            .setDescription('Check song queue'),
    async execute(message, options) {
        await message.channel.send(`Song Queue: ${message.client.queue}`)
    }
}
    
module.exports = { queue }
