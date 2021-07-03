
const mongoose = require('mongoose');   // Connect to Mongo Database
const Constants = require('../Constants').Constants;


const txnItemRecordDBSchema = new mongoose.Schema({
    itemId: {type: Number, required : true},
    itemName: String,
    itemQty: {type: Number, required : true},
    itemType: {type: Number, required : true},
    totalPrice: {type: Number, required : true},
    discountAmt: {type: Number, required : true}
});

const txnCouponRecordDBSchema = new mongoose.Schema({
    couponNmbr: {type: Number, required : true},
    couponStatus: {type: Number, required : true},
    discountAmt: {type: Number, required : true}
});

const txnPaymentRecordDBSchema = new mongoose.Schema({
    paymentTypeID: { type: Number, required : true},
    amountPaid: { type: Number, required : true}
});

const txnRecordDBSchema = new mongoose.Schema({
    txnNumber: { type: Number, required : true, unique: true } ,
    userEmail: { type: String, required : true } ,
    customerID:  Number ,
    couponList: [txnCouponRecordDBSchema] ,
    itemList: [txnItemRecordDBSchema] ,
    totalPrice: { type: Number, required : true },
    discountAmt: Number ,
    finalPrice: { type: Number, required : true },
    paymentList: [txnPaymentRecordDBSchema],
    Date: { type: Date, default: Date.now }
});
    

const TxnRecordDBModel = mongoose.model('TxnRecord' , txnRecordDBSchema);


class TxnItemRecordDBHelper
{
    constructor(itemData)
    {
        this.itemId = itemData.itemId;
        this.itemName = itemData.itemName;
        this.itemQty = itemData.itemQty;
        this.itemType = itemData.itemType;
        this.totalPrice  = itemData.totalPrice;

        this.discountAmt = 0;
        this.discountDesc = "";
        if(itemData.discount)
        {
            this.discountAmt = itemData.discount.discountAmt;
            this.discountDesc = itemData.discount.discountDesc;
        }
    }
}

class TxnCouponRecordDBHelper
{
    constructor(couponData)
    {
        this.couponNmbr = couponData.couponNmbr;
        this.couponStatus = couponData.couponStatus;
        this.discountAmt = couponData.discountAmt;
    }
}

class TxnPaymentRecordDBBHelper
{
    constructor(paymentData)
    {
        this.paymentTypeID = paymentData.paymentTypeID;
        this.amountPaid = parseFloat(paymentData.amountPaid * paymentData.payExchangeRate);
    }
}

class TxnRecordDBHelper
{
    constructor(txnData)
    {
        this.txnNumber = txnData.txnNumber;
        this.userEmail = txnData.userEmail;
        
        let headerLine = txnData.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine);
        if(headerLine && headerLine.orgTxnNumber)
            this.orgTxnNumber = headerLine.orgTxnNumber;
        
        let customer = txnData.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        if(customer)
            this.customerID = customer.custID;
        
        let couponList = txnData.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CouponLine);
        this.couponList = [];
        couponList.forEach(coupon => {
            this.couponList.push(new TxnCouponRecordDBHelper(coupon));
        });

        let itemList = txnData.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine);
        this.itemList = [];
        itemList.forEach(item => {
            this.itemList.push(new TxnItemRecordDBHelper(item));
        });
        
        this.totalPrice = txnData.totalPrice;
        this.discountAmt = txnData.discountAmt;
        this.finalPrice = txnData.finalPrice;
        
        let paymentList = txnData.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.PaymentLine);
        this.paymentList = [];
        paymentList.forEach(payment => {
            this.paymentList.push(new TxnPaymentRecordDBBHelper(payment));
        });
        
    }

    async insertToDB()
    {
        const dBObj = new TxnRecordDBModel(this);
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

    // READ 
    static async getLastTxn()
    {
        const dbLastTxn = await TxnRecordDBModel.find().sort({ txnNumber: -1 }).limit(1);
        return dbLastTxn[0];
    }
    
    static async getTxnByNmbr(TxnNmbr)
    {
        const dbTxns = await TxnRecordDBModel.find();
        return dbTxns.find(x => x.txnNumber === TxnNmbr);
    }
}

module.exports.TxnItemRecordDBHelper = TxnItemRecordDBHelper;
module.exports.TxnCouponRecordDBHelper = TxnCouponRecordDBHelper;
module.exports.TxnPaymentRecordDBBHelper = TxnPaymentRecordDBBHelper;

module.exports.TxnRecordDBHelper = TxnRecordDBHelper;
module.exports.TxnRecordDBModel = TxnRecordDBModel;
