module.exports = arrayAsString => {
    if (!arrayAsString) return ''
    return arrayAsString.split(',').map(t => t.trim())
}