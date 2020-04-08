const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const S3 = require('multer-s3')
const aws = require('aws-sdk')

const geraKey = (file, callback) => {
    crypto.randomBytes(16, (err, hash) => {
        if(err) callback(err)

        const filename = `${hash.toString('hex')}-${file.originalname}`
        callback(null, filename)
    })
}

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, callback) => {
            geraKey(file, callback)
        }
    }),

    amazon: S3({
        s3: new aws.S3(),
        bucket: 'NOME DO BUCKET',
        contentType: S3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, callback) => {
            geraKey(file, callback)
        }
    })
}

const storage_s3 = new aws.S3({
    //USAR VARIAVEIS DE AMBIENTE
})


module.exports.resolver = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes['local'],
    limits: {
        fileSize: 2 + 1024 * 1024
    },
    fileFilter: (req, file,  callback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ]

        if (allowedMimes.includes(file.mimetype)){
            callback(null, true)
        }else{
            callback(new Error('Invalid file type'))
        }
    }
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if(err) cb(err)

                file.key = `${hash.toString('hex')}-${file.originalname}`
                cb(null, file.key)
            })
        }
    })
}