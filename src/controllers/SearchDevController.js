const Dev = require('../models/dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

class SearchDevController {

    async index(req, res) {
        const { latitude, longitude, techs } = req.query
        const techsArray = parseStringAsArray(techs)

        const devs = await Dev.find({
            techs: {
                $in: techsArray
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        })
        return res.json(devs)
    }
}

module.exports = new SearchDevController()