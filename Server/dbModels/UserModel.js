
const mongoose = require('mongoose');   // Connect to Mongo Database
const Joi = require('joi');             // Request validation

const userDBSchema = new mongoose.Schema({
    email: {
        type: String,
        required : true,
        unique: true
    },
    password: {
        type: String,
        required : true
    },
    name: String,
    lastUpdateDate: {
        type: Date,
        default: Date.now
    }
});
    

function validateUser(contact) 
{
    const schema = Joi.object({
        name : Joi.string().min(3),
        email : Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
    });
    return schema.validate(contact);
}


const UserDB = mongoose.model('users' , userDBSchema);

module.exports.UserDB = UserDB;
module.exports.validateUser = validateUser;
