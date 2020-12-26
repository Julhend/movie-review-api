const express = require('express')
const app = express.Router()
const fs = require('fs')

app.delete('/file', (req, res) => {
    fs.unlink(`uploads/${req.query.fileName}`, (err) => {
        if (err) {
            res.status(404).send('file not found')
        } else {
            res.send("Ok")
        }
    })

})

module.exports = app