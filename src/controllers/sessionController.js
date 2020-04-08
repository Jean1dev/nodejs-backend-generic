const sql = require('../database/index')

module.exports = {
    async omminiStack11_ong_login(req, res) {
        const { id } = req.body

        const ong = await sql('ongs')
            .where('id', id)
            .select('name')
            .first()

        if (!ong) {
            return res.status(400).json({ error: 'ong nao encontrada' })
        }

        return res.json(ong)
    }
}