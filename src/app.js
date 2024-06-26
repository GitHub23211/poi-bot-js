const fs = require('node:fs')
const path = require('node:path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
require('dotenv').config()

const token = process.env.DISCORD_TOKEN
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent]})

function loadCollections() {
    client.commands = new Collection()
    client.prefixes = new Collection()
    client.cooldowns = new Collection()
    client.queue = []
}

function loadCommands() {
    const foldersPath = path.join(__dirname, 'commands')
    const commandFolders = fs.readdirSync(foldersPath)
    
    for(const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder)
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
        for(const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const commands = require(filePath)
            for(const command in commands) {
                if(folder === 'prefix') {
                    client.prefixes.set(command, commands[command])
                }
                else {
                    client.commands.set(command, commands[command])
                }
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

loadCollections()
loadCommands()
loadEventListeners()
client.login(token)