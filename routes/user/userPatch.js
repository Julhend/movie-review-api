const router = require("express").Router();
const errorHandler = require("../../controllers/midleware/errorMiddleware");
const userVerify = require("../../controllers/midleware/jwtMiddleWare");
const db = require('../../controllers/reviewController');
const { salt } = require('../../helpers/bcryptHelper')

router.patch('/user', userVerify, async (req, res, next) => {
    const body = req.body
    const id = req.query.id
    if (req.body.hasOwnProperty("password")) {
        const password = req.body.password
        const hashedPassword = await salt(password)
            .catch((err) => next(err))
        body.password = hashedPassword
    }
    const result = await db.edit('users', id, body)
        .catch(err => {
            next(err)
        })
    res.send(result)
})

router.use(errorHandler);
module.exports = router