const mongoose = require("mongoose");
const uniqid = require('uniqid');

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
        default: () => uniqid("data")
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        required: true,
    },
    urlCount: {
        type: Number,
        default: 0,
    },
    currentUrlCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    dailyLimit: {
        type: Number,
        default: 10
    }
});

//Creating index  on the basis of some field;
UserSchema.index({ status: 1, email: 1, isAdmin: 1, userID: 1 });

//Setting some field not to send in response
UserSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
    },
});


const User = mongoose.model('user', UserSchema)
module.exports = User;