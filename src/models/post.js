const mongoose = require('mongoose')
const aws = require('aws-sdk')
const s3 = new aws.S3()
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const schema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    createAt: {
        type: Date,
        default: Date.now
    }
})

schema.pre('save', function() {
    if(!this.url){
        //usar variavel de ambiente tambem
        this.url = `http://localhost:3000/files/${this.key}`
    }
})

schema.pre('remove', function() {
    return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key))
})

module.exports = mongoose.model('Post', schema)