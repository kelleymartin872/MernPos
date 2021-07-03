
const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');

const Constants = require('../Constants').Constants;
const UserDBHelper = require('../dbCollections/UserDB').UserDBHelper;
const UserDBModel = require('../dbCollections/UserDB').UserDBModel;
const Data = require('../DTOs/Data').Data;
const Utilities = require('../Utils/Utilities').Utilities;

router.use(express.json());


router.post('/signUp', async function(req,res)
{ 
    const routerName = "signUp";
    try
    {
        let data = process.posData.data;

        data.flowSuccess = false;
        data.posState = Constants.PosState.signedOff;

        var user = await UserDBHelper.getUsersByEmail(req.body.email);
        if(user)
        {    
            process.posData.data.errorMsg = "User with given email already exists!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(400).send(process.posData);
            return;
        }
        var validation = UserDBHelper.validate(req.body); 
        if(validation.error)
        {
            process.posData.data.errorMsg = validation.error.details[0].message;
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(400).send(process.posData);
            return;
        }
        let newUser = UserDBHelper(req.body.email, req.body.password ,req.body.name);
        await UserDBHelper.pushMultiple([newUser]);
        
        data.userEmail = newUser.email;
        data.flowSuccess = true;

        process.posData.data = data;
        process.posData.txns = [];

        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
        res.status(500).send(process.posData);
    }
    return;
});


router.post('/signIn', async function(req,res)
{
    const routerName = "signIn";
    try
    {
        let data = process.posData.data;
        
        data.errorMsg = "";
        data.userEmail = "";
        data.flowSuccess = false;
        data.posState = Constants.PosState.signedOff;

        const msg = "Invalid Email or Password!";
        const user = await UserDBHelper.getUsersByEmail(req.body.email);
        if(!user)
        {    
            process.posData.data.errorMsg = msg;
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(400).send(process.posData);
            return;
        }

        data.userEmail = user.email;

        const loginSuccess = await bcrypt.compare(req.body.password , user.password);
        if(!loginSuccess)
        {    
            process.posData.data.errorMsg = msg;
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(400).send(process.posData);
            return;
        }

        data.flowSuccess = true;
        data.posState = Constants.PosState.signedOn;

        process.posData.data = data;
        process.posData.txns = [];

        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
        res.status(500).send(process.posData);
    }
    return;
});

router.post('/signOut', async function(req,res)
{
    const routerName = "signOut";
    try
    {
        process.posData = {
            data : new Data() ,
            txns : [] 
        };

        let data = process.posData.data;
        data.flowSuccess = true;
        data.errorMsg = "";
        process.posData.data = data;
        process.posData.txns = [];
        
        res.send(process.posData);

    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
        res.status(500).send(process.posData);
    }
    return;
});

module.exports = router;