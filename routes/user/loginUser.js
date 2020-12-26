const express = require('express')
const jwt = require('jsonwebtoken')
const app = express.Router()
const db = require('../../controllers/reviewController')
const { checkPassword } = require('../../helpers/bcryptHelper')
const jwtConfig = require('../../jwtConfig')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.post('/login', async (req, res, next) => {
    const username = req.body.username
    const email = req.body.email
    const query = username ? { username } : { email }
    const password = req.body.password
    let user
    const getUserResult = await db.get('users', query)
        .catch((err) => next(err))
    user = getUserResult[0]
    if (getUserResult.length) {
        const isPasswordMatch = await checkPassword(password, user.password)
            .catch((err) => next(err))
        if (isPasswordMatch) {
            const token = jwt.sign(user, process.env.JWT_SECRET, jwtConfig.options)
            user.token = token
            delete user.password
            res.send(user)
        } else {
            res.status(401).send('Wrong Password')
        }
    } else {
        res.status(401).send('Wrong Username or Email')
    }
})

app.use(mysqlErrorHandler)
module.exports = app