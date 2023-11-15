const { getOneUser, getAllUser, countUser, updateOneUserById } = require('../service/user.service');

exports.getAllUsers = async (req, res, next) => {
    const { page = 0, limit = 10 } = req.query;
    const { email } = req;

    const admin = await getOneUser({ email, isAdmin: true });
    if (!admin) {
        return next('No user found.');
    }

    const users = await getAllUser({ isAdmin: false, page, limit });
    if (!users) {
        return next('Somthing went wrong, try again later!');
    }

    const count = await countUser();
    if (!count) {
        return next("Something went wrong!");
    }

    return res.status(200).send({
        message: "All users.",
        data: users,
        total: count,
        pageSize: users.length,
    });
}

exports.userStatusUpdate = async (req, res, next) => {
    const { status } = req.body;
    const { userID } = req.params;
    const { email } = req;

    const admin = await getOneUser({ email, isAdmin: true });
    if (!admin) {
        return next('No user found.');
    }

    const user = await updateOneUserById({ userID, status });
    if (!user) {
        return next('Somthing went wrong, try again later!');
    }

    return res.status(200).send({
        message: "Status successfully updated!",
        data: user
    });
}