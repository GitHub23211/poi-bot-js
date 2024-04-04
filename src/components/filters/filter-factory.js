module.exports = class FilterFactory {

    static build(filterName, value) {
        switch(filterName) {
            case 'bass':
                //value is a floating point number between -20.0 to 20.0
                //`bass=g={value}`
                return `bass=g=${value}`
            case 'volume':
                //value is a floating point number between 0.0 to 2.0
                //`volume={value}`
                return `volume=${value}`
            default:
                return
        }
    }

}