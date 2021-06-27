
const mongoose = require('mongoose');   // Connect to Mongo Database

const itemDBSchema = new mongoose.Schema({
    itemId: {type: String, required : true, unique: true},
    itemName: { type: String, required : true },
    itemPrice: { type: Number, required : true },
    discountDesc: String,
    discountAmt: Number,
    discountType: Number,
    lastUpdateDate: { type: Date, default: Date.now }
});

const ItemDBModel = mongoose.model('Item' , itemDBSchema);

class ItemDBHelper
{
    constructor(itemId,itemName,itemPrice, discountDesc="", discountAmt = 0, discountType = 0)
    {
        this.itemId= itemId;
        this.itemName= itemName;
        this.itemPrice= itemPrice;

        this.discountDesc= discountDesc;
        this.discountAmt= discountAmt;
        this.discountType= discountType;
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

    static async getItems(body)
    {
        const dbItems = await ItemDBModel.find();
        return dbItems.filter(x => x.itemId.toLowerCase().includes(body.itemId) 
                                && x.itemName.toLowerCase().includes(body.itemName.toLowerCase()));
    }
}

module.exports.ItemDBHelper = ItemDBHelper;
module.exports.ItemDBModel = ItemDBModel;
