const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const passport = require('../../controllers/midleware/authenticationMiddleware')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.patch('/review', passport.authenticate('bearer', { session: false }), async (req, res, next) => {
    const body = req.body
    const query = req.query
    const id = query.id
    const result = await db.get('review', query)
    try {
        if (result.length == 0) {
            return res.status(404).send('Data Not Found')
        }
        else {
            const results = await db.edit('review', id, body)
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