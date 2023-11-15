const express = require('express');
const routes = express.Router();
const adminController = require('../controller/admin.controller');

routes.get('/allusers', adminController.getAllUsers);
routes.put('/update-user/:userID', adminController.userStatusUpdate);

module.exports = routes;