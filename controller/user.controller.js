const bcrypt = require('bcrypt');
const { createAnalytics } = require('../utils/analytics');
const { generateAccessToken, generateToken, resetPassToken } = require('../middleware/auth');
const { getOneUser, getAnyUser, createOneUser, updateOneUser } = require('../service/user.service');
const { hashedPass } = require('../utils/hashing');
const { getOneUsersActiveUrls, getOneUsersAllUrls } = require('../service/url.service');

exports.getProfile = async (req, res, next) => {
    const { email } = req;

    const user = await getOneUser({ email });
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

    const user = await getOneUser({ email });
    if (!user) {
        return next('No user found')
    }
    else {
        const validPassword = await bcrypt.compare(password, user?.password);
        if (validPassword) {
            const token = generateToken(email)
            const accessToken = generateAccessToken(email)

            return res.status(200).send({
                message: "Login successful.",
                data: {
                    accessToken,
                    token,
                    admin: user?.isAdmin,
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

    const oldUser = await getAnyUser({ email });
    if (oldUser) {
        return next('User already exist.');
    }

    req.body.password = await hashedPass(password);

    const newUser = await createOneUser(req.body);
    if (!newUser) {
        return next("Something went wrong.");
    }

    createAnalytics("user");

    return res.status(200).send({
        message: "User creation Success.",
        data: newUser
    });
}

//Request from user to reset pass using email
exports.resetRequest = async (req, res, next) => {
    const { email } = req.body;
    const user = await getOneUser({ email });
    if (!user) {
        return next('No user found');
    }

    const resetToken = resetPassToken(email);

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
    const { email } = req;

    const user = await getOneUser({ email });
    if (!user) {
        return next('No user found');
    }

    req.body.password = await hashedPass(password);

    const data = await updateOneUser({ email, password: req.body.password });
    if (!data) {
        return next("Error, Try again later!");
    }

    return res.status(200).send({
        message: "Your password successfully reseted, now you can login.",
    });
}

exports.refreshToken = async (req, res, next) => {
    const { email } = req;

    const user = await getOneUser({ email });
    if (!user) {
        return next('No user found.');
    }

    const accessToken = generateAccessToken(req.email);

    return res.status(200).send({
        message: "New access token.",
        data: {
            accessToken,
        }
    });
}

exports.usersState = async (req, res, next) => {
    const { userID } = req.params;
    const { email } = req;

    const user = await getOneUser({ email });
    if (!user) {
        return next('No user found.');
    }

    const usersData = await getAnyUser({ userID });
    if (!usersData) {
        return next('No user found.');
    }

    const usersUrls = await getOneUsersActiveUrls({userID});
    if (!usersUrls) {
        return next('Somthing went wrong, try again later!');
    }

    const count = await getOneUsersAllUrls({userID});
    if (!count) {
        return next("Something went wrong.");
    }

    return res.status(200).send({
        message: "Users stats.",
        data: {
            totalUrls: count.length,
            activeURLs: usersUrls.length,
            leftURLs: usersData?.dailyLimit
        }
    });
}
