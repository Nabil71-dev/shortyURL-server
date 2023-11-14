const Url = require('../model/url.model');
const User = require('../model/user.model');
const _ = require('underscore');
const { getOneUsersAllUrls } = require('../service/url.service');
const { updateOneUserByMail } = require('../service/user.service');

//Delete expired URL
exports.schedulerExpireUrl = async (req, res, next) => {
    let urls = await Url.find({});
    if (!urls) {
        return next('Somthing went wrong, try again later!')
    }

    console.log("Expires url updating")
    const date = Date.now();
    let flag1 = true;

    _.each(urls, async (exist) => {
        const newLists = _.filter(exist.userIDs, (exist) => exist.expiresIn >= date);

        const data = await Url.findOneAndUpdate({ urlID: exist.urlID }, {
            $set: { userIDs: newLists },
        }, { new: true });

        if (!data) {
            flag1 = false;
        }
        else if (data && flag1) {
            flag1 = true;
        }
    });

    flag1 ? console.log({
        message: 'Expires url update complete.'
    }) : console.log({
        message: 'Somthing went wrong, try again later!'
    });

    const users = await User.find({});
    if (!users) {
        return next('Somthing went wrong, try again later!')
    }
    console.log("URL count updating, also updating daily limit.")

    let flag2 = true;

    _.each(users, async (user) => {
        const { userID } = user;

        let usersUrls = await getOneUsersAllUrls({ userID })
        if (!usersUrls) {
            return next('Somthing went wrong, try again later!')
        }

        const newData = {
            currentUrlCount: usersUrls?.length,
            dailyLimit: 10
        };
        const data = await updateOneUserByMail({ email: user.email, ...newData });
        if (!data) {
            flag2 = false;
        } else if (data && flag2) {
            flag2 = true;
        }
    });

    flag2 ? console.log({
        message: 'URL count update & Daily limit update done.'
    }) : console.log({
        message: 'Somthing went wrong, try again later!'
    });
}