const express = require('express');
const routes = express.Router()
const mainUrlController = require('../controller/mainUrl.controller')

routes.get('/:shortenedurl', mainUrlController.getMainURL);

module.exports = routes;


