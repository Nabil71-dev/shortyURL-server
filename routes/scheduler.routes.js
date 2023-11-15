const express = require('express');
const routes = express.Router();
const schedulerController = require('../controller/scheduler.controller');

routes.get('/cron-job', schedulerController.schedulerExpireUrl);

module.exports = routes;