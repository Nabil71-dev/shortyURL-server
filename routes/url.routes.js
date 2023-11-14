const express = require('express');
const routes = express.Router()
const urlController = require('../controller/url.controller')

routes.post('/short-create', urlController.shortUrlCreate);
routes.get('/user/:userID', urlController.usersAllShortened);
routes.get('/admin/all-urls', urlController.allShortened);

module.exports = routes;