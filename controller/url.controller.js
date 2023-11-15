const shortId = require('shortid');
const Url = require('../model/url.model');
const axios = require('axios');
const { createAnalytics } = require('../utils/analytics');
const _ = require('underscore');
const { getOneUser } = require('../service/user.service');
const { originalUrlExist, updateUsersDataonCreation, createUrl, getOneUsersAllUrlsData, getAllUrls } = require('../service/url.service');

//Create short URL by user
exports.shortUrlCreate = async (req, res, next) => {
    const { originalUrl, expiresIn } = req.body;
    const { email } = req;

    const user = await getOneUser({ email });
    if (!user) {
        return next('User not found.');
    }

    const { userID, dailyLimit } = user;
    const newShrotUrl = {
        userID,
        shortenedurl: shortId.generate(),
        createdAt: Date(),
        expiresIn: expiresIn + Date.now()
    };

    if (dailyLimit > 0) {
        const isExist = await originalUrlExist({ originalUrl });
        if (isExist) {
            if (isExist?.userIDs?.some(obj => Object?.values(obj)?.includes(userID))) {
                return res.status(200).send({
                    message: 'Already exist',
                    data: isExist
                });
            }

            isExist.userIDs.push(newShrotUrl);
            const newUserIdInsert = await existUrlUpdate({ originalUrl, userIDs: isExist.userIDs });
            if (!newUserIdInsert) {
                return next("Something went wrong!, try again later.");
            }

            const data = updateUsersDataonCreation({ user })
            if (!data) {
                return next("Error, Try again later!");
            }

            createAnalytics("urls");

            return res.status(200).send({
                message: 'Creation successfull',
                data: newUserIdInsert
            });
        }

        try {
            await axios.post(process.env.NETLIFY_URL, {
                url: originalUrl
            });
        } catch (error) {
            return next("Invalid url!");
        }

        const newUrlCreation = await createUrl({ urlData: req.body, shortyData: newShrotUrl });
        if (!newUrlCreation) {
            return next("Something went wrong.");
        }

        const data = updateUsersDataonCreation({ user });
        if (!data) {
            return next("Error, Try again later!");
        }

        createAnalytics("urls");

        return res.status(200).send({
            message: "Url successfully shortened.",
            data: newUrlCreation
        });
    }

    return next('Your daily limit is over.');
}

//Get short URLs created by a user
exports.usersAllShortened = async (req, res, next) => {
    const { userID } = req.params;
    const { page = 0, limit = 10 } = req.query;
    const { email } = req;

    const user = await getOneUser({ email });
    if (!user) {
        return next('User not found.');
    }

    const usersUrls = await getOneUsersAllUrlsData({ userID, page, limit });
    if (!usersUrls) {
        return next('Somthing went wrong, try again later!');
    }

    _.each(usersUrls, async (items) => {
        let replaceData = [];
        for (let it = 0; it < items?.userIDs?.length; it++) {
            if (items?.userIDs[it]?.userID == userID) {
                replaceData?.push(items?.userIDs[it]);
                break;
            }
        }
        items.userIDs = [];
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
    const { email } = req;

    const admin = await getOneUser({ email, isAdmin: true });
    if (!admin) {
        return next('User not found');
    }

    let urls = await getAllUrls({ page, limit });
    if (!urls) {
        return next('Somthing went wrong, try again later!');
    }

    const count = await Url.find({});
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