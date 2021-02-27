
const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');

const Constants = require('../Constants').Constants;
const UserDBHelper = require('../dbCollections/UserDB').UserDBHelper;
const UserDBModel = require('../dbCollections/UserDB').UserDBModel;

router.use(express.json());


router.post('/signUp', async function(req,res)
{ 
    try
    {
        var user = await UserDBHelper.getUsersByEmail(req.body.email);
        if(user)
        {    
            res.status(400).send("User with given email already exists!");
            return;
        }
        var validation = UserDBHelper.validate(req.body); 
        if(validation.error)
        {
            res.status(400).send(validation.error.details[0].message);
            return;
        }
        let newUser = UserDBHelper(req.body.email, req.body.password ,req.body.name);
        await UserDBHelper.pushMultiple([newUser]);
        
        data = process.posData.data;
        data.userEmail = newUser.email;
        data.signedUp = true;
        data.signedIn = false;
        data.posState = Constants.PosState.signedOn;

        process.posData.data = data;
        process.posData.txns = [];

        res.send(process.posData);
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});


router.post('/signIn', async function(req,res)
{
    try
    {
        let data = process.posData.data;
        data.errorMsg = "";
        data.userEmail = "";
        data.signedUp = false;
        data.signedIn = false;
        data.posState = Constants.PosState.signedOff;

        const msg = "Invalid Email or Password!";
        const user = await UserDBHelper.getUsersByEmail(req.body.email);
        if(!user)
        {    
            data.errorMsg = msg;
            res.status(400).send(process.posData);
            return;
        }

        data.userEmail = user.email;

        const loginSuccess = await bcrypt.compare(req.body.password , user.password);
        if(!loginSuccess)
        {    
            data.errorMsg = msg;
            res.status(400).send(process.posData);
            return;
        }

        data.signedIn = true;
        data.posState = Constants.PosState.signedOn;

        process.posData.data = data;
        process.posData.txns = [];

        res.send(process.posData);
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }

});

router.post('/signOut', async function(req,res)
{
    try
    {
        data = process.posData.data;

        data.userEmail = "";
        data.signedUp = false;
        data.signedIn = false;
        data.posState = Constants.PosState.signedOff;
        
        process.posData.data = data;
        process.posData.txns = [];
        
        res.send(process.posData);

    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});

module.exports = router;