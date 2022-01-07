const path = require('path')
const fs = require('fs')
const axios = require('axios').default
const File = require('../models/file')
const Box = require('../models/box')
const FormData = require("form-data")
const BASIC_MAILGUN_KEY = process.env.BASIC_MAILGUN_KEY

const BASE_URL = 'https://ldc-integra-homolog.azurewebsites.net'

let logs = []

const http = axios.create({
    baseURL: BASE_URL
})

const files = [
    {
        name: '01-registrar_simulacao.txt',
        endpoint: 'carga-contrato-reg-simulacao'
    },
    {
        name: '02-alterar_simulacao.txt',
        endpoint: 'carga-contrato-alt-simulacao'
    },
    {
        name: '03-alterar_preco.txt',
        endpoint: 'carga-contrato-alt-preco'
    },
    {
        name: '04-calcular_contrato.txt',
        endpoint: 'carga-contrato-calcular'
    },
    {
        name: '05-efetivar_contrato.txt',
        endpoint: 'carga-contrato-efetivar'
    },
    {
        name: '06-gerar_contrato.txt',
        endpoint: 'carga-contrato-gerar'
    },
    {
        name: '07-gerar_codigoExterno.txt',
        endpoint: 'carga-contrato-codigo-externo'
    },
    {
        name: '08-gerar_codigo_refer.txt',
        endpoint: 'carga-contrato-dados-complementares'
    },
    {
        name: '08-1-gerar_path_contrato.txt',
        endpoint: 'carga-contrato-completar'
    }
]

function addLog(...content) {
    console.log(...content)
    logs.push(...content)
    logs.push('\n')
}

function handleAxiosError(error, item) {
    addLog('falha ao enviar o item ', item['PK_LDC'])
    if (error.isAxiosError) {
        addLog(error.request.path, error.config.data)
        return {
            status: 500,
            body: error?.response?.data?.message,
            pkLDC: item['PK_LDC']
        }
    }

    return {
        status: 500,
        body: error.message,
        pkLDC: item['PK_LDC']
    }
}

async function sendRequestWaitResponse(endpoint, payload) {
    addLog('request to ', endpoint)
    try {
        const response = await http.post(endpoint, payload)
        return {
            status: response.status,
            body: response.data,
            pkLDC: payload[0]['PK_LDC']
        }
    } catch (error) {
        return handleAxiosError(error, payload[0])
    }
}

function enviarEmail(endpoint) {
    const emails = [
        'jeanluca.fernandes@totvs.com.br',
        'carlos.torres@totvs.com.br'
    ]

    emails.forEach(email => {
        const form = new FormData()
        form.append('from', 'Jean apps <jean@central.apps.com>')
        form.append('to', email)
        form.append('subject', 'Resultado carga de dados ' + endpoint)
        form.append('text', endpoint)
        form.append('attachment', fs.createReadStream(path.resolve(__dirname, 'log-execucao.txt')))

        axios({
            method: 'post',
            url: 'https://api.mailgun.net/v3/central.binnoapp.com/messages',
            data: form,
            headers: { Authorization: `Basic ${BASIC_MAILGUN_KEY}`, ...form.getHeaders() }
        }).then(response => {
            console.log(response.data, response.status)
        }).catch(error => {
            console.log(error.message)
        })
    })
}

async function enviarDados(dados, endpoint) {
    const resultados = await Promise.all(dados.map(async item => {
        return sendRequestWaitResponse(endpoint, [item])
    }))

    fs.writeFileSync(path.resolve(__dirname, 'log-execucao.txt'), logs.toString())
    logs = []
    enviarEmail(endpoint)
    return resultados
}

async function startAsyncProc(__file, filename) {
    fs.readFile(path.resolve(__dirname, '..', '..', 'tmp', filename), (err, data) => {
        if (err) {
            addLog('erro ao tentar ler o arquivo ', filename)
            return
        }

        const lines = data.toString().split(/\r?\n/)
        for (let index = lines.length - 1; index > 0; index--) {
            if (String(lines[index]).includes(',')) {
                lines[index] = '}'
                break
            }
        }

        const contentAsJson = JSON.parse(lines.join(''))
        enviarDados(contentAsJson, __file.endpoint)
    })
}

class FileController {

    async store(req, res) {
        const box = await Box.findById(req.params.id)

        const file = await File.create({
            title: req.file.originalname,
            path: req.file.key
        })

        box.files.push(file)
        await box.save()
        console.log(file.title)
        const deveProcessar = files.find(__file => __file.name === file.title)
        if (deveProcessar) {
            startAsyncProc(deveProcessar, file.path)
        }

        req.io.sockets.in(box._id).emit('file', file)
        return res.json(file)
    }
}

module.exports = new FileController()
