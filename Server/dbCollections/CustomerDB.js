

const mongoose = require('mongoose');   // Connect to Mongo Database
const Joi = require('joi');             // Request validation

const customerModelSchema = new mongoose.Schema({
    custID: {
        type: Number,
        required : true,
        unique: true
    },
    custName: {
        type: String,
        required : true
    },
    phoneNumber:  {
        type: Number,
        required : true,
        unique: true
    },
    points: Number,
    lastUpdateDate: {
        type: Date, 
        default: Date.now 
    }
});


function validateCustomer(customer) 
{
    const schema = Joi.object({
        custName : Joi.string().min(3).required(),
        phoneNumber : Joi.number().min(6).required()
    });
    return schema.validate(customer);
}

const CustomerDBModel = mongoose.model('Customer' , customerModelSchema);


class CustomerDBHelper
{
    constructor(custName,phoneNumber)
    {
        this.custID= phoneNumber;
        this.custName= custName;
        this.phoneNumber= phoneNumber;
        this.points = 0;
    }

    async insertToDB()
    {
        const dBObj = new CustomerDBModel(this);
        const mongoResult = await dBObj.save();
        return;
    }

    static pushMultiple(elements)
    {
        for(var i = 0 ; i < elements.length ; i++)
        {
            elements[i].insertToDB();
        }   
    }
}

module.exports.CustomerDBHelper = CustomerDBHelper;
module.exports.CustomerDBModel = CustomerDBModel;
module.exports.validateCustomer = validateCustomer;