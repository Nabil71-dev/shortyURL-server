const jwt = require('jsonwebtoken');
const signature = `${process.env.TOKEN_SECRET}-SHORTY`

exports.generate_token = ({email, expiresIn}) => {
    const token = jwt.sign({ email }, signature, {
        expiresIn,
    });

    return token;
}