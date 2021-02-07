
const mongoose = require('mongoose');   // Connect to Mongo Database
const Joi = require('joi');             // Request validation

const itemDBSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required : true,
        unique: true
    },
    itemName: {
        type: String,
        required : true
    },
    itemPrice: {
        type: Number,
        required : true
    },
    discount: {
        type: Number
    },
    lastUpdateDate: {
        type: Date,
        default: Date.now
    }
});
    
function validateItem(contact) 
{
    const schema = Joi.object({
        itemName : Joi.string().min(1).required(),
        itemPrice : Joi.string().min(1).required()
    });
    return schema.validate(contact);
}


const ItemDBModel = mongoose.model('Item' , itemDBSchema);


class ItemDBHelper
{
    constructor(itemId,itemName,itemPrice, discount = 0)
    {
        this.itemId= itemId;
        this.itemName= itemName;
        this.itemPrice= itemPrice;
        this.discount= discount;
    }

    async insertToDB()
    {
        const dBObj = new ItemDBModel(this);
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

module.exports.ItemDBHelper = ItemDBHelper;
module.exports.ItemDBModel = ItemDBModel;
module.exports.validateItem = validateItem;
