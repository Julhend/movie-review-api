const { verify } = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const userVerify = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.split(" ")[1];
        try {
            const payload = verify(token, secret);
            req.user = payload;
            next()
        } catch (err) {
            res.status(401).send("Token expired, please login");
        }
    } else {
        res.status(401).send("User unauthorized");
    }
};

module.exports = userVerify;