
const mongoose = require('mongoose');   // Connect to Mongo Database
const Joi = require('joi');             // Request validation

const contactDBSchema = new mongoose.Schema({
    id: {
        type: String,
        required : true
    },
    name: {
        type: String,
        required : true
    },
    phone: Number,
    isFavourite : {
        type: Boolean,
        default: false
    },
    lastUpdateDate: {
        type: Date, 
        default: Date.now 
    }
});


function validateContact(contact) 
{
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        phone : Joi.number().min(6).required(),
        isFavourite : Joi.boolean()
    });
    return schema.validate(contact);
}


const ContactDB = mongoose.model('contacts' , contactDBSchema);

module.exports.ContactDB = ContactDB;
module.exports.validateContact = validateContact;


