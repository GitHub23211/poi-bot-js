const { SlashCommandBuilder } = require('discord.js')

const ping = { 
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!')
    }
}

const server = {
    data: new SlashCommandBuilder()
            .setName('server')
            .setDescription('Provides information about the server'),
    async execute(interaction) {
        await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members`)
    }
}

module.exports = {
    ping,
    server
}