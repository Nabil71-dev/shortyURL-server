const express = require('express');
const routes = express.Router();
const analyticsController = require('../controller/analytics.controller');

routes.get('/numbers', analyticsController.fixedNumbers);
routes.get('/users', analyticsController.userYearData);
routes.get('/urls', analyticsController.urlsYearData);

module.exports = routes;