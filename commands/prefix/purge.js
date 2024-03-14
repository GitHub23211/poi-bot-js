const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')

/**
 * Bulk delete messages in the channel the command was sent in
 * @param message - Message passed from Event
 * @param options - Array with one element - number of messages to delete
 */
const purge = {
    data: new PrefixCommandBuilder()
            .setName('purge')
            .setDescription('Bulk delete messages'),
    async execute(message, options) {
        const channel = message.channel
        if(!channel) return
        channel.bulkDelete(options[0])
    }
}
    
module.exports = { purge }