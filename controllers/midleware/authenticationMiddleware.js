const jwt = require('jsonwebtoken')
const jwtConfig = require('../../jwtConfig')
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy

passport.use(new BearerStrategy(
    function (token, done) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError')
                    done(null, false)
                done(err)
            }
            done(null, decoded);
            done.user = decoded
        })
    }
))

module.exports = passport