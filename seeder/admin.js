const mongoose = require('mongoose')
const User = require('../model/user.model')
const { hashedPass } = require('../utils/hashing');

const user = [
    new User({
        name: "I'm Admin",
        email: 'admin@gmail.com',
        password: 'Hello@123',
        isAdmin: true
    }),
]

// DATABASE CONNECTION
mongoose
    .connect("mongodb+srv://mahmudnabiliiuc:rc6oyDLBjY1nIDDd@urlshortener.wcofvu1.mongodb.net/test", { useNewUrlParser: true })
    .catch(err => {
        console.log(err.stack);
        process.exit(1);
    })
    .then(() => {
        console.log("connected to db in development environment");
    });

user.map(async (u, index) => {
    try {
        u.password = await hashedPass(u.password)
        u.isAdmin = true

        const savedAdmin = await u.save();
        console.log("Admin seeding done!!");
    } catch (error) {
        console.log(error);
    }
});