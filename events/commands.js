const { Events } = require('discord.js')

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

module.exports = {
    handleSlash
}