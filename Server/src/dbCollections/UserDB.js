
const mongoose = require('mongoose');   // Connect to Mongo Database
const Joi = require('joi');             // Request validation
const bcrypt = require('bcrypt');

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
    Date: {
        type: Date,
        default: Date.now
    }
});
    

const UserDBModel = mongoose.model('User' , userDBSchema);


class UserDBHelper
{
    constructor(email,password,name = "")
    {
        this.email = email;
        this.password = password;
        this.name = name;
    }

    async insertToDB()
    {
        const dBObj = new UserDBModel(this);
        const mongoResult = await dBObj.save();
        return;
    }

    static async getUsersByEmail(email)
    {
        const dbUsers = await UserDBModel.find();
        return dbUsers.find(x => x.email.toLowerCase() === email.toLowerCase());
    }

    static async bryptPassword(password)
    {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    static async pushMultiple(elements)
    {
        for(var i = 0 ; i < elements.length ; i++)
        {
            let user = elements[i]
            UserDBHelper.bryptPassword(user.password).then( hash =>
            {
                user.password = hash;
                user.insertToDB();
            });
        }   
    }

    static validate(user) 
    {
        const schema = Joi.object({
            name : Joi.string().min(3),
            email : Joi.string().min(6).required().email(),
            password : Joi.string().min(6).required()
        });
        return schema.validate(user);
    }
}

module.exports.UserDBHelper = UserDBHelper;
module.exports.UserDBModel = UserDBModel;
