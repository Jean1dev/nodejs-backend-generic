const sql = require('../database/index')

module.exports = {
    async create(req, res) {
        const { title, description, value } = req.body
        const ong_id = req.headers.authorization
        
        const [id] = await sql('casos').insert({
            title,
            description,
            value,
            ong_id
        })

        return res.json({ id })
    },

    async findAll(req, res) {
        const { page = 1 } = req.query

        const [count] = await sql('casos').count()
        const casos = await sql('casos')
            .join('ongs', 'ongs.id', '=', 'casos.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'casos.*', 
                'ongs.name', 
                'ongs.email', 
                'ongs.whatsapp', 
                'ongs.city', 
                'ongs.uf'
            ])
        
        res.header('X-Total-Count', count['count(*)'])
        return res.json(casos)
    },

    async delete(req, res) {
        const { id } = req.params
        const ong_id = req.headers.authorization

        const caso = await sql('casos')
            .where('id', id)
            .select('ong_id')
            .first()

        if (caso.ong_id != ong_id) {
            return res.status(401).json({ error: 'Operacao nao permitida' })
        }

        await sql('casos').where('id', id).delete()
        return res.status(204).send()
    }
}