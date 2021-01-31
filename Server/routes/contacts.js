
const express = require('express'); 
const router = express.Router();
const uuid = require('uuid');

const ContactDB = require('../dbModels/ContactModel').ContactDB;
const validateContact = require('../dbModels/ContactModel').validateContact;

router.use(express.json());


//#region "Get Request" Read

async function getDBContact(id)               // Mongo DB SELECT
{
    const dbContacts = await ContactDB
        .find( {id: id} );   
        
    return(dbContacts[0]);
    //return contacts.find(x => x.id == id);
}

async function getDBAllContacts(id)               // Mongo DB SELECT
{
    const dbContacts = await ContactDB
        .find();   
        
    return(dbContacts);
}

router.get('/getAllContacts', function(req,res)
{
    getDBAllContacts()
        .then(contacts => res.send(contacts))
        .catch(err => res.send("Error: " + err));
});


//#endregion

//#region "Post Request" Create

async function insertDBContact(contact)
{
    const contactDBObj = new ContactDB(contact);
    await contactDBObj.save();
    return;
}

router.post('/newContact', async function(req,res)
{ 
    var validation = validateContact(req.body);
    if(validation.error)
        res.status(400).send(validation.error.details[0].message);
    else
    {
        var contact = {
            id: uuid.v4(),
            name: req.body.name,
            phone: parseInt(req.body.phone),
            isFavourite: req.body.isFavourite
        };
        insertDBContact(contact)
            .then(() =>
            {
                getDBAllContacts()
                    .then(contacts => res.send(contacts))
                    .catch(err => res.send("Error: " + err));            
            })
            .catch(err => res.send("Error: " + err));
    }
});

//#endregion

//#region "Put Request" Update

async function updateDBContact(id , newContact)
{
    const dbContact = await ContactDB
        .find( {id: id} );
    
    dbContact[0].name = newContact.name;
    dbContact[0].phone = newContact.phone;
    dbContact[0].isFavourite = newContact.isFavourite;

    await dbContact[0].save();

    return;
}

router.put('/updateContact/:id', async function(req,res)
{
    var contact = await getDBContact(req.params.id)
    if(!contact)
        res.status(404).send("Error 404 : The contact with given ID was not found !");
    else
    {
        var validation = validateContact(req.body);
        if(validation.error)
            res.status(400).send(validation.error.details[0].message);
        else
        {
            updateDBContact(req.params.id , req.body)
                .then(() =>
                {
                    getDBAllContacts()
                        .then(contacts => res.send(contacts))
                        .catch(err => res.send("Error: " + err));
                })
                .catch(err => res.send("Error: " + err));
        }
    }
});

//#endregion

//#region "Delete Request"

async function deleteDBContact(id)
{
    await ContactDB.deleteOne( {id: id} );
    return;
}

router.delete('/removeContact/:id', async function(req,res)
{		
    var contact = await getDBContact(req.params.id)
    if(!contact)
        res.status(404).send("Error 404 : The contact with given ID was not found !");
    else
    {
        deleteDBContact(req.params.id)
            .then(() =>
            {
                getDBAllContacts()
                    .then(contacts => res.send(contacts))
                    .catch(err => res.send("Error: " + err));
            })
            .catch(err => res.send("Error: " + err));
    }
});
//#endregion

module.exports = router;