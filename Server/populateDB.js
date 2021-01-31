
const mongoose = require('mongoose');   // Connect to Mongo Database
const uuid = require('uuid');
const ContactDB = require('./dbModels/ContactModel').ContactDB;   


mongoose.connect('mongodb://localhost/nodeApp', { useNewUrlParser: true , useUnifiedTopology: true } )
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log("Error Connecting to MongoDB :: " , err));

//#region Contacts

var contacts = [
    { id: uuid.v4() , name:'Tejas' , phone: 9930860936 , isFavourite: true },
    { id: uuid.v4() , name:'Mosh' , phone: 9876543210 , isFavourite: false },
    { id: uuid.v4() , name:'Jarvis' , phone: 9988776655 , isFavourite: false }
];

async function insertDBContact(contact)
{
    const contactDBObj = new ContactDB(contact);
    const mongoResult = await contactDBObj.save();
    return;
}

for(var i = 0 ; i < contacts.length ; i++)
{
    insertDBContact(contacts[i]);
}

//#endregion

