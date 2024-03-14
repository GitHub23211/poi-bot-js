module.exports = class PrefixCommandBuilder {
    options = []
    name = ''
    description = ''

    setName(name) {
        this.name = name
        return this
    }

    setDescription(desc) {
        this.description = desc
        return this
    }
}