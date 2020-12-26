const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const { v4: uuidv4 } = require('uuid');
const passport = require('../../controllers/midleware/authenticationMiddleware')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.post('/watchlists', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    const body = req.body
    body.userId = req.user.userId
    body.id = uuidv4()
    const result = await db.get('watch_list', { movieId: req.body.movieId, userId: req.body.userId })
    try {
        if (result.length > 0) {
            return res.status(409).send('You already add this movie to your watch list')
        }
        else {

            const add = await db.add("watch_list", body)
                .catch((err) => next(err))
            res.send(add)
        }
    } catch (err) {
        next(err)
    }
})
app.use(mysqlErrorHandler)

module.exports = app