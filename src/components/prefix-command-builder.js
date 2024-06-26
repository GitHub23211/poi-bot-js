module.exports = class PrefixCommandBuilder {
    name = ''
    description = ''
    cooldown = 0

    setName(name) {
        this.name = name
        return this
    }

    setDescription(desc) {
        this.description = desc
        return this
    }

    setCooldown(num) {
        this.cooldown = num*1000
        return this
    }
}