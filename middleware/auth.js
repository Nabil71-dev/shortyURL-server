const jwt = require('jsonwebtoken');
const { generate_token } = require('../utils/generate_token');

const authenticateToken = (req, res, next) => {
    const { authorization } = req.headers;
    const signature = `${process.env.TOKEN_SECRET}-SHORTY`;

    try {
        const token = authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send({
                message: "Deniend!"
            });
        }

        const decoded = jwt.verify(token, signature);
        const { email } = decoded;
        req.email = email;
        next();

    } catch (err) {
        return res.status(403).send({ message: "Access denied." });
    }
}

const generateToken = (mail) => {
    const token = generate_token({ email: mail, expiresIn: process.env.REFRESH_TOKEN });
    return token;
}

const generateAccessToken = (mail) => {
    const token = generate_token({ email: mail, expiresIn: process.env.ACCESS_TOKEN });
    return token;
}

const resetPassToken = (mail) => {
    const token = generate_token({ email: mail, expiresIn: process.env.RESET_TOKEN });
    return token;
}

module.exports = {
    authenticateToken,
    generateToken,
    generateAccessToken,
    resetPassToken
}