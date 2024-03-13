const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
require('dotenv').config()

const commandArr = []

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const commands = require(filePath)
        for(const command in commands) {
            commandArr.push(commands[command].data.toJSON())
        }
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commandArr.length} slash commands`)

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
            { body: commandArr }
        )

        for(d in data) {
            console.log(d)
        }

        console.log(`Success: ${data}`)
    } catch (e) {
        console.log(e)
    }
})();