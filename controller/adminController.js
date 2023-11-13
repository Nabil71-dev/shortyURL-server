const User = require('../model/user.model')

exports.getAllUsers = async (req, res, next) => {
    const { page = 0, limit = 10 } = req.query;
    const admin = await User.find({ email: req.email, isAdmin: true, status: true });
    if (!admin) {
        return next('No user found')
    }

    let users = await User.find({ isAdmin: false }).skip(page).limit(limit).sort({ createdAt: -1 });
    if (!users) {
        return next('Somthing went wrong, try again later!')
    }
    
    const count = await User.countDocuments({})
    if (!count) {
        return next("Something went wrong");
    }

    return res.status(200).send({
        message: "All users",
        data: users,
        total: count,
        pageSize: users.length,
    });
}

exports.userStatusUpdate = async (req, res, next) => {
    const { status } = req.body
    const { userID } = req.params;

    const admin = await User.findOne({ email: req.email, isAdmin: true, status: true });
    if (!admin) {
        return next('No user found')
    }

    const user = await User.findOneAndUpdate({ userID }, {
        $set: { status },
    }, { new: true }).select('-password -__v')

    if (!user) {
        return next('Somthing went wrong, try again later!')
    }
    return res.status(200).send({
        message: "Status successfully updated!",
        data: user
    });
}

// exports.oneUser = async (req, res) => {
//     const { userID } = req.params;

//     const admin = await User.findOne({ email: req.email, isAdmin: true, status: true });
//     if (!admin) {
//         next('No user found')
//     }

//     const user = await User.findOne({ userID })
//     if (!user) {
//         next('Somthing went wrong, try again later!')
//     }
//     return res.status(200).send({
//         message: "User found",
//         data: user
//     });
// }