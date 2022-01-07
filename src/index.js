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

const corsOptions = {
    origin: '*',
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

// app.use(function (req, res, next) {
//     console.log('set header cors')
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next()
// })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')))
app.use(require(`./routes`))

server.listen(port, () => {
    console.log(`rodando na porta ${port}`)
})
