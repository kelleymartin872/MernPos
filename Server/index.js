
const express = require('express');     // Middleware to handle HTTP REST API  
const mongoose = require('mongoose');   // Connect to Mongo Database

const home = require('./src/apiServices/home');         
const userService = require('./src/apiServices/userService');
const itemService = require('./src/apiServices/itemService');
const customerService = require('./src/apiServices/customerService');
const couponService = require('./src/apiServices/couponService');
const paymentService = require('./src/apiServices/paymentService');
const transactionService = require('./src/apiServices/transactionService');

const Data = require('./src/DTOs/Data').Data;

mongoose.connect('mongodb://localhost/MernPosDB', { useNewUrlParser: true , useUnifiedTopology: true } )
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log("Error Connecting to MongoDB :: " , err));

var app = express();

process.posData = {
    data : new Data() ,
    txns : [] 
};

//#region "Routing"

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use('/api/userService', userService);                   //direct to user api service
app.use('/api/itemService', itemService);                   //direct to items api service
app.use('/api/couponService', couponService);               //direct to coupon api service
app.use('/api/customerService', customerService);           //direct to customers api service
app.use('/api/paymentService', paymentService);             //direct to payments api service
app.use('/api/transactionService', transactionService);     //direct to transaction api service

app.use('/', home);                     //direct to a home router

//#endregion

//#region  "Open PORT : 3000"

const port = 4000;  // Take port number from Environment variable
app.listen(port, function()
{
    console.log(`Listening to port ${port} ...`);
});

//#endregion