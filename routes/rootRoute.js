
const express = require('express')
const app = express.Router()


app.get('/', (req, res) => {
    res.send(" Teamf-backend server Running ")
})

module.exports = app