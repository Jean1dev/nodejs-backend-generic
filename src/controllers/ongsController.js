const sql = require('../database/index')
const crypto = require('crypto')

module.exports = {
    async create(req, res) {
        const { name, email, whatsapp, city, uf } = req.body
        const id = crypto.randomBytes(4).toString('HEX')

        await sql('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        })

        return res.json({ id })
    },

    async findAll(req, res) {
        return res.json(await sql('ongs').select('*'))
    },
}