const Url = require('../model/url.model');
const User = require('../model/user.model');
const underscore = require('underscore');

//Delete expired URL
exports.schedulerExpireUrl = async (req, res,next) => {
    let urls = await Url.find({});
    if (!urls) {
        return next('Somthing went wrong, try again later!')
    }

    console.log("Expires url updating")
    const date = Date.now();
    let flag1 = true;
    underscore.map(urls, async (exist) => {
        const newLists = underscore.filter(exist.userIDs, (exist) => exist.expiresIn >= date);
        const data = await Url.findOneAndUpdate({ urlID: exist.urlID }, {
            $set: { userIDs: newLists },
        }, { new: true })
        if (!data) {
            flag1 = false;
        }
        else if (data && flag1) {
            flag1 = true;
        }
    });

    if (flag1) {
        console.log({
            message: 'Expires url update complete'
        })
    }
    else {
        console.log({
            message: 'Somthing went wrong, try again later!'
        })
    }



    let users = await User.find({});
    if (!users) {
        return next('Somthing went wrong, try again later!')
    }
    console.log("URL count updating, also updating daily limit")

    let flag2 = true;
    underscore.map(users, async (user) => {
        const { userID } = user
        let usersUrls = await Url.find({ userIDs: { $elemMatch: { userID } } });
        if (!usersUrls) {
            return next('Somthing went wrong, try again later!')
        }

        const data = await User.findOneAndUpdate({ email: user.email }, {
            $set: {
                currentUrlCount: usersUrls.length,
                dailyLimit: 10
            },
        }, { new: true })
        if (!data) {
            flag2 = false;
        }
        else if (data && flag2) {
            flag2 = true;
        }
    });

    if (flag2) {
        console.log({
            message: 'URL count update & Daily limit update done'
        })
    }
    else {
        console.log({
            message: 'Somthing went wrong, try again later!'
        })
    }
}