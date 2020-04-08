const Dev = require('../models/dev')
const axios = require('axios')
const parseStringAsArray = require('../utils/parseStringAsArray')

class Controller {

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body
        const response = await axios.get(`https://api.github.com/users/${github_username}`)
        const { name = login, avatar_url, bio } = response.data
        const techsArray = parseStringAsArray(techs)
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
        const dev = await Dev.create({
            github_username,
            techs: techsArray,
            avatar_url,
            name,
            bio,
            location
        })
        return res.json(dev)
    }

    async findAll(req, res) {
        return res.json(await Dev.find())
    }
}

module.exports = new Controller()