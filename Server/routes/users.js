
const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');

const UserDB = require('../dbModels/UserModel').UserDB;
const validateUser = require('../dbModels/UserModel').validateUser;

router.use(express.json());

//#region "Register new User" 

async function getDBUser(email)               // Mongo DB SELECT
{
    const dbUser = await UserDB
        .find( {email: email} );   
    return(dbUser[0]); 
}

async function bryptPassword(password)
{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function insertDBUser(user)
{
    const userDBObj = new UserDB(user); 
    await userDBObj.save();
    return;
}

router.post('/newUser', async function(req,res)
{ 
    var user = await getDBUser(req.body.email);
    if(user)
        res.status(400).send("User with given email already exists!");
    else
    {
        var validation = validateUser(req.body); 
        if(validation.error)
            res.status(400).send(validation.error.details[0].message);
        else
        {

            var newUser = { 
                email: req.body.email,
                password: req.body.password,
                name: req.body.name
            };
            newUser.password = await bryptPassword(newUser.password);
            
            insertDBUser(newUser)
                .then(res.send({user: newUser.email, logIn:true}))
                .catch(err => res.send(res.send(err)));
        }
    }
});



router.post('/authUser', async function(req,res)
{
    const msg = "Invalid Email or Password!";
    var user = await getDBUser(req.body.email);
    if(!user)
        res.status(400).send(msg);
    else
    {
        const loginSuccess = await bcrypt.compare(req.body.password , user.password);
        if(!loginSuccess)
            res.status(400).send(msg);
        else
            res.send({user: user.email, logIn:true});
    }
});

module.exports = router;