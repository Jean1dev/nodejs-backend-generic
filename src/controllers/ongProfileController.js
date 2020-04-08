const sql = require('../database/index')

module.exports = {
    async findAll(req, res) {
        const ong_id = req.headers.authorization
        const casos = await sql('casos')
            .where('ong_id', ong_id)
            .select('*')

        return res.json(casos)
    }
}