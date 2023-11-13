const Analytics = require('../model/analytics.model');

exports.createAnalytics = async (type) => {
    const date = new Date();
    const analyticsExist = await Analytics.findOne({ year: date.getFullYear(), type });
    if (!analyticsExist) {
        const analytics = new Analytics();
        analytics.year = date.getFullYear();
        analytics.months[date.getMonth()]++;
        analytics.type = type;

        const newRecordCreation = await analytics.save();
        if (!newRecordCreation) {
            console.log("Something went wrong")
        }
    }
    else {
        analyticsExist.months[date.getMonth()]++;
        const data = await Analytics.findOneAndUpdate({ year: date.getFullYear(), type }, {
            $set: {
                months: analyticsExist.months
            },
        }, { new: true })
        if (!data) {
            console.log('Something went wrong');
        }
    }
}