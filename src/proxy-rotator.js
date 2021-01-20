const express = require('express')
const proxy = require('express-http-proxy')

const port = process.env.PORT || 4000
const app = express()

app.use('/', proxy('http://185.198.188.55:8080'))

app.listen(port, err => {
    if (err) {
        console.log(err)
    }
    console.log('Proxy endpoint started.')
})

module.exports = app