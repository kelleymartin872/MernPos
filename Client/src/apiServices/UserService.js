
import TotalLine from './Txn_Lines/TotalLine';
import ItemLine from './Txn_Lines/ItemLine'
import HeaderlLine from './Txn_Lines/HeaderLine';
import CustomerLine from './Txn_Lines/CustomerLine';
import Constants from '../Constants';

export default class UserService
{
    constructor()
    {


    }

    signOut()
    {

    }


}

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
        const msg = "Invalid Email or Password!";
        var user = await UserDBHelper.getUsersByEmail(req.body.email);
        if(!user)
        {    
            res.status(400).send(msg);
            return;
        }
        const loginSuccess = await bcrypt.compare(req.body.password , user.password);
        if(!loginSuccess)
        {    
            res.status(400).send(msg);
            return;
        }

        data = process.posData.data;
        data.userEmail = user.email;
        data.signedUp = false;
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

        if(data.posState === Constants.PosState.signedOn &&
            data.signedIn === true)
        {
            data.userEmail = "";
            data.signedUp = false;
            data.signedIn = false;
            data.posState = Constants.PosState.signedOff;
            
            process.posData.data = data;
            process.posData.txns = [];
        }
        
        res.send(process.posData);

    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});

module.exports = router;