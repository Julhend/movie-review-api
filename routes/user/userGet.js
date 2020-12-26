const express = require('express')
const app = express.Router()
const db = require('../../controllers/reviewController')
const passport = require('../../controllers/midleware/authenticationMiddleware')
const routeErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.get('/user', passport.authenticate('bearer', { session: false }), (req, res, next) => {
    const body = req.body
    const id = req.user.userId
    body.id = id
    db.get('users', body)
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            next(err)
        })
})

app.use(routeErrorHandler)

module.exports = app