const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const { v4: uuidv4 } = require('uuid');
const passport = require('../../controllers/midleware/authenticationMiddleware')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.post('/review', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    const body = req.body
    body.userId = req.user.userId
    let ts = Date.now()
    let getdate = new Date(ts)
    let date = getdate.getDate();
    let month = getdate.getMonth();
    let year = getdate.getUTCFullYear();
    let datenow = year + "-" + month + "-" + date

    body.id = uuidv4()
    body.date = datenow
    const result = await db.get('review', { movieId: req.body.movieId, userId: req.body.userId })
    try {
        if (result.length > 0) {
            return res.status(409).send('You already create review on this movie')
        }
        else {

            const add = await db.add('review', body)
                .catch((err) => next(err))
            res.send(add)
        }
    } catch (err) {
        next(err)
    }

})
app.use(mysqlErrorHandler)

module.exports = app