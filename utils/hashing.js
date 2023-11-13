const bcrypt = require('bcrypt');

exports.hashedPass=(password)=>{
    const salt = bcrypt.genSaltSync(10);
    hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}