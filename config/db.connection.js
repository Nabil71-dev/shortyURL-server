const dbConfig = require('./db.config');
const mongoose = require('mongoose')

exports.dbConncetion = () => {
    try {
        mongoose.connect(dbConfig.db, { useNewUrlParser: true, useUnifiedTopology: true, })
        console.log("Success");
    } catch (err) {
        console.log(`Database can't be connected: ${err}`);
    }
}