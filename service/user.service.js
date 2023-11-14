const User = require('../model/user.model')

const createOneUser = (value) => {
    const user = new User(value);
    return user.save()
}

const getOneUser = ({ ...value }) => {
    return User.findOne({ ...value, status: true });
}

const getAnyUser = ({ ...value }) => {
    return User.findOne({ ...value });
}

const getAllUser = ({ page, limit, ...value }) => {
    return User.find({ ...value }).skip(page)
        .limit(limit).sort({
            createdAt: -1
        });
}

const updateOneUserById = ({ userID, ...value }) => {
    return User.findOneAndUpdate({ userID }, {
        $set: { ...value },
    }, { new: true }).select('-password -__v')
}

const updateOneUserByMail = ({ email, ...value }) => {
    return User.findOneAndUpdate({ email }, {
        $set: { ...value },
    }, { new: true }).select('-password -__v')
}

const countUser = () => {
    return User.countDocuments({});
}

module.exports = {
    getOneUser,
    getAllUser,
    getAnyUser,
    countUser,
    updateOneUserById,
    updateOneUserByMail,
    createOneUser
}