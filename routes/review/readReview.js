const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const passport = require('../../controllers/midleware/authenticationMiddleware')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.get('/review', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    const query = req.query
    const result = await db.getUserReview('review', query)
        .catch(err => {
            next(err)
        })
    //validasi
    if (result == 0) {
        res.status(404).send('Data That You Are Looking For Is Not Found')
    } else {
        res.send(result)
    }

})

app.use(mysqlErrorHandler)

module.exports = app