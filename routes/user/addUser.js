const express = require('express')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../../jwtConfig')
const app = express.Router()
const db = require('../../controllers/reviewController')
const { salt } = require('../../helpers/bcryptHelper')
const { v4: uuidv4 } = require('uuid');

const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')

app.post('/register', async (req, res, next) => {
    const body = req.body
    const result = await db.get('users', { userName: body.userName } && { email: body.email })
        .catch((err) => next(err))
    try {
        if (result.length > 0) {
            return res.status(409).send('Username or email already used')
        }
        else {
            const password = req.body.password
            let body = req.body
            body.userId = uuidv4()
            const hashedPassword = await salt(password)
                .catch((err) => next(err))
            body.password = hashedPassword
            const addUserResult = await db.add('users', body)
                .catch((err) => next(err))
            if (addUserResult) {
                const token = jwt.sign(addUserResult, process.env.JWT_SECRET, jwtConfig.options)
                addUserResult.token = token
                delete addUserResult.password
                res.send(addUserResult)
            }
        }
    } catch (err) {
        next(err)
    }

})
app.use(mysqlErrorHandler)
module.exports = app