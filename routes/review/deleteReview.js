const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const passport = require('../../controllers/midleware/authenticationMiddleware')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.delete('/review', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    const query = req.query
    const body = req.body
    body.userId = req.user.id
    const result = await db.get('review', query)
    try {
        if (result.length == 0) {
            return res.status(409).send('Data Not Found')
        }
        else {
            const results = await db.remove("review", query)
                .catch(err => {
                    next(err)
                })
            res.send(results)
        }
    } catch (err) {
        next(err)
    }
})


app.use(mysqlErrorHandler)

module.exports = app