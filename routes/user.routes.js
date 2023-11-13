const express=require('express');
const routes=express.Router()
const userController=require('../controller/userController')

routes.get('/profile',userController.getProfile);
routes.post('/login',userController.login);
routes.post('/signup',userController.createUser);
routes.post('/reset-req',userController.resetRequest);
routes.post('/set-pass',userController.setUpPass);
routes.get('/token/refresh',userController.refreshToken);
routes.get('/state/:userID',userController.usersState);

module.exports=routes;