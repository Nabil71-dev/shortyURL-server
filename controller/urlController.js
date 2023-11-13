const shortId = require('shortid')
const Url = require('../model/url.model');
const User = require('../model/user.model');
const axios = require('axios');
const { createAnalytics } = require('../utils/analytics')
const underscore = require('underscore');

//Create short URL by user
exports.shortUrlCreate = async (req, res, next) => {
    const { originalUrl, expiresIn } = req.body;
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return next('User not found')
    }

    const { userID, dailyLimit } = user;
    if (dailyLimit > 0) {
        const isExist = await Url.findOne({ originalUrl });
        if (isExist) {
            if (isExist.userIDs.some(obj => Object.values(obj).includes(userID))) {
                return res.status(200).send({
                    message: 'Already exist',
                    data: isExist
                })
            }

            isExist.userIDs.push({
                userID,
                shortenedurl: shortId.generate(),
                createdAt: Date(),
                expiresIn: expiresIn + Date.now()
            })
            const newUserIdInsert = await Url.findOneAndUpdate({ originalUrl }, {
                $set: { userIDs: isExist.userIDs },
            }, { new: true })

            if (!newUserIdInsert) {
                return next("Something went wrong!, try again later");
            }

            const data = await User.findOneAndUpdate({ email: user.email, isAdmin: false }, {
                $set: {
                    dailyLimit: user.dailyLimit - 1,
                    urlCount: user.urlCount + 1,
                    currentUrlCount: user.currentUrlCount + 1
                },
            }, { new: true })

            if (!data) {
                return next("Error, Try again later!");
            }
            createAnalytics("urls");

            return res.status(200).send({
                message: 'Creation successfull',
                data: newUserIdInsert
            })
        }

        const url = new Url(req.body);

        try {
            await axios.post(process.env.NETLIFY_URL, {
                url: originalUrl
            });
            // url.flag = true;
        } catch (error) {
            // Handle error
            return next("Invalid url");
        }

        url.userIDs.push({
            userID,
            shortenedurl: shortId.generate(),
            createdAt: Date(),
            expiresIn: expiresIn + Date.now()
        })

        const newUrlCreation = await url.save();
        if (!newUrlCreation) {
            return next("Something went wrong");
        }

        const data = await User.findOneAndUpdate({ email: user.email, isAdmin: false }, {
            $set: {
                dailyLimit: user.dailyLimit - 1,
                urlCount: user.urlCount + 1,
                currentUrlCount: user.currentUrlCount + 1
            },
        }, { new: true })
        if (!data) {
            return next("Error, Try again later!");
        }

        createAnalytics("urls");
        return res.status(200).send({
            message: "Url successfully shortened",
            data: newUrlCreation
        });
    }

    return next('Your daily limit is over');
}

//Get short URLs created by a user
exports.usersAllShortened = async (req, res, next) => {
    const { userID } = req.params;
    const { page = 0, limit = 10 } = req.query;

    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return next('User not found')
    }

    let usersUrls = await Url.find({ userIDs: { $elemMatch: { userID } } }).skip(page).limit(limit).sort({ createdAt: -1 });
    if (!usersUrls) {
        return next('Somthing went wrong, try again later!')
    }

    underscore.map(usersUrls, async (items) => {
        let replaceData = [];
        for (let it = 0; it < items.userIDs.length; it++) {
            if (items.userIDs[it].userID == userID) {
                replaceData.push(items.userIDs[it])
                break;
            }
        }
        items.userIDs = []
        items.userIDs = replaceData;
    });

    return res.status(200).send({
        message: "All URL's",
        data: usersUrls,
        total: usersUrls.length,
    });
}

//Get all short URLs created by all users for admin
exports.allShortened = async (req, res, next) => {
    const { page = 0, limit = 10 } = req.query;
    const admin = await User.findOne({ email: req.email, isAdmin: true, status: true });
    if (!admin) {
        return next('User not found')
    }

    let urls = await Url.find({}).skip(page * limit).limit(limit).sort({ createdAt: -1 });
    if (!urls) {
        return next('Somthing went wrong, try again later!')
    }

    const count = await Url.find({})
    if (!count) {
        return next("Something went wrong");
    }
    return res.status(200).send({
        message: "All URL's",
        total: count.length,
        data: urls,
        pageSize: urls.length,
    });
}