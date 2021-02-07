
const express = require('express');     // Middleware to handle HTTP REST API  
const mongoose = require('mongoose');   // Connect to Mongo Database
const contacts = require('./routes/contacts');     
const users = require('./routes/users');     
const home = require('./routes/home');         


mongoose.connect('mongodb://localhost/MernPosDB', { useNewUrlParser: true , useUnifiedTopology: true } )
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log("Error Connecting to MongoDB :: " , err));

var app = express();

//#region "Routing"

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use('/api/users', users);           //direct to a users router
app.use('/api/contacts', contacts);     //direct to a contacts router
app.use('/', home);                     //direct to a home router

//#endregion

//#region  "Open PORT : 3000"

const port = 4000;  // Take port number from Environment variable
app.listen(port, function()
{
    console.log(`Listening to port ${port} ...`);
});

//#endregion