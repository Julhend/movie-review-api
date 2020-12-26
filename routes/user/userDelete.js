const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const passport = require('../../controllers/midleware/authenticationMiddleware')
const routeErrorHandler = require('../../controllers/midleware/errorMiddleware')


app.delete('/user', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    const query = req.query
    const result = await db.get('users', query)
    try {
        if (result.length == 0) {
            return res.status(404).send('Data Not Found')
        }
        else {
            const read = await db.get('review', query) && await db.get('watch_list', query)
                .catch(err => {
                    next(err)
                })
            if (read) {
                await db.remove("review", query) && await db.remove("watch_list", query)
                    .catch(err => {
                        next(err)
                    })
            }
            const results = await db.remove("users", query)
                .catch(err => {
                    next(err)
                })
            res.send(results)
        }
    } catch (err) {
        next(err)
    }

})

app.use(routeErrorHandler)
module.exports = app
