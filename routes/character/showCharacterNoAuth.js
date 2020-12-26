const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const passport = require('../../controllers/midleware/authenticationMiddleware')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.get('/movie/character', async (req, res, next) => {
    const query = req.query
    const result = await db.getCharacter('artist', query)
        .catch(err => {
            next(err)
        })
    if (result == 0) {
        res.status(404).send('Data that you are looking for is not found')
    } else {
        res.send(result)
    }

})


app.use(mysqlErrorHandler)

module.exports = app