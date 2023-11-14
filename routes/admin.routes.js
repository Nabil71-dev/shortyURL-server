const express = require('express');
const routes = express.Router()
const adminController = require('../controller/admin.controller')

routes.get('/allusers', adminController.getAllUsers);
// routes.get('/user/:userID',adminController.oneUser);
routes.put('/update-user/:userID', adminController.userStatusUpdate);

module.exports = routes;