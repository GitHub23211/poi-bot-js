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

        const command = message.client.prefixes.get(message.content.slice(2, message.content.length))

        if(!command) return

        console.log(command)
    }
}

module.exports = {
    handleSlash,
    handlePrefix
}