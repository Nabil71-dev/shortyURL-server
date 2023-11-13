const mongoose = require("mongoose");
const uniqid = require('uniqid');
const shortId = require('shortid')

const UrlSchema = new mongoose.Schema({
    urlID: {
        type: String,
        required: true,
        unique: true,
        default: () => uniqid("data")
    },
    originalUrl: {
        type: String,
        required: true,
    },
    shortenedUrl: {
        type: String,
        required:true,
        default : shortId.generate
    },
    userIDs:[],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

//Creating index  on the basis of some field;
UrlSchema.index({ urlID: 1, originalUrl: 1, userIDs: 1 });

//Setting some field not to send in response
UrlSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Url = mongoose.model('url', UrlSchema)
module.exports = Url;