const express = require(`express`)
const morgan = require(`morgan`)
const db = require('./config/db.config')
const path = require('path')
const cors = require('cors')
const port = process.env.PORT || 8080
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', socket => {
    socket.on('connectRom', box => {
        socket.join(box)
    })
})

db()
app.use((req, res, next) => {
    req.io = io
    next()
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(morgan('dev'))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')))
app.use(require(`./routes`))

server.listen(port, () => {
    console.log(`rodando na porta ${port}`)
})