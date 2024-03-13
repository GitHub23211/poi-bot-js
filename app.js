const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
require('dotenv').config()

const token = process.env.DISCORD_TOKEN
const client = new Client({intents: [GatewayIntentBits.Guilds]})

function loadCommands() {
    client.commands = new Collection()
    const foldersPath = path.join(__dirname, 'commands')
    const commandFolders = fs.readdirSync(foldersPath)
    
    for(const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder)
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
        for(const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const commands = require(filePath)
            for(const command in commands) {
                client.commands.set(command, commands[command])
            }
        }
    }
}


function loadEventListeners() {
    const eventsPath = path.join(__dirname, 'events')
    const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))
    
    for(const file of eventsFiles) {
        const filePath = path.join(eventsPath, file)
        const events = require(filePath)
        for(const name in events) {
            const event = events[name]
            if(event.once) {
                client.once(event.name, (...args) => event.execute(...args))
            }
            else {
                client.on(event.name, (...args) => event.execute(...args))
            }
        }
    }
}

loadCommands()
loadEventListeners()
client.login(token)