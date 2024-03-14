const { Events } = require('discord.js')

require('dotenv').config()

const PREFIX = 'f'

const handleSlash = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const command = interaction.client.commands.get(interaction.commandName)

        if(!command) {
            interaction.reply(`No command matching ${interaction.commandName}`)
            return
        }
    
        try {
            await command.execute(interaction)
        } catch (e) {
            console.error(e)
        }
    }
}

const handlePrefix = {
    name: Events.MessageCreate,
    async execute(message) {
        if(!message.guildId == process.env.GUILD_ID || !message.content.startsWith(PREFIX)) return
        
        const raw = message.content.split(' ')
        const command = message.client.prefixes.get(raw[0].slice(2, raw[0].length))
        const options = raw.slice(1)

        if(!command) return

        try {
            await command.execute(message, options)
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = {
    handleSlash,
    handlePrefix
}