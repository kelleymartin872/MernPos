
const mongoose = require('mongoose');   // Connect to Mongo Database
const Joi = require('joi');             // Request validation


const txnItemRecordDBSchema = new mongoose.Schema({
    itemId: {type: String, required : true},
    itemQty: {type: Number},
    itemPrice: {type: Number, required : true},
    discount: {type: Number}
});

const txnCouponRecordDBSchema = new mongoose.Schema({
    couponNumber: {type: Number, required : true},
    discount: {type: Number, required : true},
    status: {type: Number, required : true}
});

const txnPaymentRecordDBSchema = new mongoose.Schema({
    paymentTypeID: { type: Number, required : true},
    paidAmount: { type: Number, required : true}
});

const txnRecordDBSchema = new mongoose.Schema({
    txnNumber: { type: Number, required : true, unique: true } ,
    userID: { type: Number, required : true } ,
    customerID:  Number ,
    couponList: [txnCouponRecordDBSchema] ,
    itemList: [txnItemRecordDBSchema] ,
    totalPrice: { type: Number, required : true },
    discount: Number ,
    finalPrice: { type: Number, required : true },
    paymentList: [txnPaymentRecordDBSchema],
    Date: { type: Date, default: Date.now }
});
    

const TxnRecordDBModel = mongoose.model('TxnRecord' , txnRecordDBSchema);


class TxnItemRecordDBHelper
{
    constructor(itemId,itemPrice,itemQty=1,discount=0)
    {
        this.itemId = itemId;
        this.itemQty = itemQty;
        this.itemPrice = itemPrice;
        this.discount = discount;
    }
}
class TxnCouponRecordDBHelper
{
    constructor(couponNumber,discount,status=1)
    {
        this.couponNumber = couponNumber;
        this.discount = discount;
        this.status = status;
    }
}
class TxnPaymentRecordDBBHelper
{
    constructor(paymentTypeID,paidAmount)
    {
        this.paymentTypeID = paymentTypeID;
        this.paidAmount = paidAmount;
    }
}

class TxnRecordDBHelper
{
    constructor(txnNumber,userID,customerID,itemList,totalPrice,paymentList,discount=0,couponList=[])
    {
        this.txnNumber = txnNumber;
        this.userID = userID;
        this.customerID = customerID;
        this.couponList = couponList;
        this.itemList = itemList;
        this.totalPrice = totalPrice;
        this.discount = discount;
        this.finalPrice = totalPrice - discount;
        this.paymentList = paymentList;
    }

    async insertToDB()
    {
        const dBObj = new UserDBModel(this);
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

module.exports.TxnItemRecordDBHelper = TxnItemRecordDBHelper;
module.exports.TxnCouponRecordDBHelper = TxnCouponRecordDBHelper;
module.exports.TxnPaymentRecordDBBHelper = TxnPaymentRecordDBBHelper;

module.exports.TxnRecordDBHelper = TxnRecordDBHelper;
module.exports.TxnRecordDBModel = TxnRecordDBModel;
