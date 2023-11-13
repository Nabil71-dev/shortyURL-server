const express=require('express');
const routes=express.Router()
const mainUrlController=require('../controller/mainUrlController')

routes.get('/:shortenedurl',mainUrlController.getMainURL);

module.exports=routes;


