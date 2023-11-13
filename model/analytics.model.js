const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
    },
    months: {
        type: [Number],
        default: function () {
            return new Array(12).fill(0);
        }
    },
    type: {
        type: String,
        required: true,
    }
});

//Creating index  on the basis of some field;
AnalyticsSchema.index({ year: 1, type: 1 });

//Setting some field not to send in response
AnalyticsSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Analytics = mongoose.model('analytics', AnalyticsSchema)
module.exports = Analytics;