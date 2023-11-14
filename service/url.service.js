const Url = require('../model/url.model');
const { updateOneUserByMail } = require('./user.service');

const createUrl = ({ urlData, shortyData }) => {
    const url = new Url(urlData);
    url.userIDs.push(shortyData);
    return url.save();
}

const updateUsersDataonCreation = async ({ user }) => {
    const updatedData = {
        dailyLimit: user?.dailyLimit - 1,
        urlCount: user?.urlCount + 1,
        currentUrlCount: user?.currentUrlCount + 1
    };

    const newCreate = await updateOneUserByMail({ email: user.email, ...updatedData });
    return newCreate;
}

const existUrlUpdate = ({ originalUrl, userIDs }) => {
    return Url.findOneAndUpdate({ originalUrl }, {
        $set: { userIDs },
    }, { new: true })
}

const originalUrlExist = ({ originalUrl }) => {
    return Url.findOne({ originalUrl })
}

const getOneUsersActiveUrls = ({ userID }) => {
    const date = Date.now();

    return Url.find({
        userIDs: {
            $elemMatch: {
                userID,
                expiresIn: {
                    $gt: date
                }
            }
        }
    });
}

const getOneUsersAllUrls = ({ userID }) => {
    return Url.find({
        userIDs: {
            $elemMatch: {
                userID
            }
        }
    });
}

const getOneUsersAllUrlsData = ({ userID, page, limit }) => {
    return Url.find({
        userIDs: {
            $elemMatch: {
                userID
            }
        }
    }).skip(page).limit(limit).sort({ createdAt: -1 });
}

const getUrlUsingShortened = ({ shortenedurl }) => {
    return Url.findOne({
        userIDs: {
            $elemMatch: {
                shortenedurl
            }
        }
    });
}

const getAllUrls = ({ page, limit }) => {
    return Url.find({}).skip(page * limit).limit(limit).sort({ createdAt: -1 })
}



module.exports = {
    getOneUsersActiveUrls,
    getOneUsersAllUrls,
    originalUrlExist,
    createUrl,
    existUrlUpdate,
    updateUsersDataonCreation,
    getOneUsersAllUrlsData,
    getAllUrls,
    getUrlUsingShortened,
}