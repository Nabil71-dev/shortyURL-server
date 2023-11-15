const User = require('../model/user.model');
const Url = require('../model/url.model');
const Analytics = require('../model/analytics.model');
const _ = require('underscore');
const { getOneUser } = require('../service/user.service');

exports.fixedNumbers = async (req, res, next) => {
    const { email } = req;

    const admin = await getOneUser({ email });
    if (!admin) {
        return next('User not found');
    }

    let users = await User.find({});
    if (!users) {
        return next('Somthing went wrong, try again later!');
    }

    const urls = await Url.find({});
    if (!urls) {
        return next('Somthing went wrong, try again later!');
    }


    let totalUsers = 0, totalUrls = 0, activeUrls = 0;

    users = _.filter(users, user => !user?.isAdmin);
    _.each(users, user => (
        totalUrls += user.urlCount,
        activeUrls += user.currentUrlCount
    ));
    totalUsers = users?.length;

    return res.status(200).send({
        message: "All number statistics",
        totalUsers,
        createdUrls: totalUrls,
        activeUrls,
        totalUrls: urls?.length
    });
}

exports.userYearData = async (req, res, next) => {
    const { email } = req;

    const admin = await getOneUser({ email });
    if (!admin) {
        return next('User not found')
    }

    const data = await Analytics.find({ type: 'user' });
    if (!data) {
        return next('Somthing went wrong, try again later!');
    }

    return res.status(200).send({
        message: `All users by years`,
        data
    });
}

exports.urlsYearData = async (req, res, next) => {
    const { email } = req;

    const admin = await getOneUser({ email });
    if (!admin) {
        return next('User not found');
    }

    const data = await Analytics.find({ type: 'urls' });
    if (!data) {
        return next('Somthing went wrong, try again later!');
    }

    return res.status(200).send({
        message: `All created urls by years`,
        data
    });
}