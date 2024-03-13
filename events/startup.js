const { Events } = require('discord.js')

const onStart = {
    name: Events.ClientReady,
    once: true,
    execute(bot) {
        console.log(`Ready! Connected as ${bot.user.tag}`)
    }
}

module.exports = {
    onStart
}