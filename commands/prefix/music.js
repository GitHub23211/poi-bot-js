const PrefixCommandBuilder = require('../../components/prefix-command-builder.js')

const play = {
    data: new PrefixCommandBuilder()
            .setName('test')
            .setDescription('test'),
    async execute(interaction) {
        await interaction.reply('test')
    }
}
    
module.exports = {
    play
}
