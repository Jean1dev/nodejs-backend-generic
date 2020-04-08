const init = () => {
    const mongo = require('mongoose')

    mongo.connect('mongodb://127.0.0.1:27017/omnistack', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = init