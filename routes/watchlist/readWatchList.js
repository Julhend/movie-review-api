const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const passport = require('../../controllers/midleware/authenticationMiddleware')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.get('/watchlists', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    const query = req.query
    const result = await db.getWatchList('watch_list', query)
        .catch(err => {
            next(err)
        })
    if (result == 0) {
        res.status(404).send(`You haven't added a movie to your watch list`)
    } else {
        res.send(result)
    }

})
app.use(mysqlErrorHandler)

module.exports = app