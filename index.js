const express = require('express')
const cors = require('cors')
const { unless } = require("express-unless");
const bodyParser = require('body-parser')
require('dotenv').config();
const mongoose = require('mongoose')
const DbConfig = require('./config/DbConfig');
const auth = require('./middleware/auth');
const errors = require("./middleware/error.js");
const { noAuthRoutes } = require("./utils/constant.js");
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// DATABASE CONNECTION
try {
  mongoose.connect(DbConfig.db, { useNewUrlParser: true, useUnifiedTopology: true, })
  console.log("Success");
} catch (err) {
  console.log(`Database can't be connected: ${err}`);
}

//Skipping auth for routes that are in noAuthRoutes file
auth.authenticateToken.unless = unless;
app.use(
  auth.authenticateToken.unless({
    path: noAuthRoutes
  })
);

//Testing routes
app.get("/test", (req, res) => {
  return res.status(200).send({
    message: 'Testing success'
  })
})

// initialize routes
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/url", require("./routes/url.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/s/", require("./routes/original.routes"));
app.use("/scheduler", require("./routes/scheduler.routes"));

//error handler
app.use(errors.errorHandler);

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log("You are connected");
});