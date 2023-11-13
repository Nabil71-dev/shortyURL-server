const express=require('express');
const routes=express.Router()
const schedulerController=require('../controller/schedulerController')

routes.get('/cron-job',schedulerController.schedulerExpireUrl);

module.exports=routes;