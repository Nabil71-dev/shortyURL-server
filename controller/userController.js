const bcrypt = require('bcrypt');
const Url = require('../model/url.model');
const User = require('../model/user.model');
const { createAnalytics } = require('../utils/analytics')
const { generateAccessToken, generateToken, resetPassToken } = require('../middleware/auth');

exports.getProfile = async (req, res, next) => {
    const { email } = req;
    const user = await User.findOne({ email, status: true });
    if (!user) {
        return next('No user found')
    }

    return res.status(200).send({
        message: "User found!",
        data: user
    });
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, status: true });
    if (!user) {
        return next('No user found')
    }
    else {
        const validPassword = await bcrypt.compare(password, user?.password);
        if (validPassword) {
            const token = generateToken(email)
            const accessToken = generateAccessToken(email)

            return res.status(200).send({
                message: "Login successful",
                data: {
                    accessToken,
                    token,
                    admin:user?.isAdmin,
                    expiresIn: 3600000 + Date.now()
                }
            });
        } else {
            return next("Login error!");
        }
    }
}

exports.createUser = async (req, res, next) => {
    const { email, password } = req.body;
    const olduser = await User.findOne({ email });
    if (olduser) {
        return next('User already exist')
    }

    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(password, salt);

    const user = new User(req.body);

    const newUser = await user.save()
    if (!newUser) {
        return next("Something went wrong");
    }
    createAnalytics("user");
    return res.status(200).send({
        message: "User creation Success",
        data: newUser
    });
}

//Request from user to reset pass using email
exports.resetRequest = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email, status: true });
    if (!user) {
        return next('No user found')
    }

    const resetToken = resetPassToken(email)
    return res.status(200).send({
        message: "User found!",
        data: {
            token: resetToken,
        }
    });
}

//Reset password
exports.setUpPass = async (req, res, next) => {
    const { password } = req.body;

    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return next('No user found')
    }

    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(password, salt);

    const data = await User.findOneAndUpdate({ email: req.email }, {
        $set: { password: req.body.password },
    }, { new: true })
    if (data) {
        return res.status(200).send({
            message: "Your password successfully reseted, now you can login",
        });
    }
    else {
        return next("Error, Try again later!");
    }
}

exports.refreshToken = async (req, res, next) => {
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return next('No user found')
    }

    const accessToken = generateAccessToken(req.email)
    return res.status(200).send({
        message: "New access token",
        data: {
            accessToken,
        }
    });
}

exports.usersState = async (req, res, next) => {
    const { userID } = req.params;
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return next('No user found')
    }

    const usersData = await User.findOne({ userID });
    if (!usersData) {
        return next('No user found')
    }

    const date = Date.now();
    const usersUrls = await Url.find({ userIDs: { $elemMatch: { userID, expiresIn: { $gt: date } } } });
    if (!usersUrls) {
        return next('Somthing went wrong, try again later!')
    }

    const count = await Url.find({ userIDs: { $elemMatch: { userID } } })
    if (!count) {
        return next("Something went wrong");
    }

    return res.status(200).send({
        message: "Users stats",
        data: {
            totalUrls:count.length,
            activeURLs: usersUrls.length,
            leftURLs: usersData?.dailyLimit
        }
    });
}
