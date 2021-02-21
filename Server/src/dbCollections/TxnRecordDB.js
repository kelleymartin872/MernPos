
const mongoose = require('mongoose');   // Connect to Mongo Database
const Constants = require('../Constants').Constants;


const txnItemRecordDBSchema = new mongoose.Schema({
    itemId: {type: String, required : true},
    itemQty: {type: Number},
    totalPrice: {type: Number, required : true},
    discountAmt: {type: Number}
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
    userEmail: { type: Number, required : true } ,
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
        this.itemId= itemData.itemId;
        this.itemQty = itemData.itemQty;
        this.totalPrice  = titemData.totalPrice;
        this.discountAmt = itemData.discount.discountAmt;
    }
}

class TxnCouponRecordDBHelper
{
    constructor(couponData)
    {
        this.couponNmbr = couponData.couponNmbr;
        this.couponStatus = couponData.couponStatus;
        this.discountAmt = couponData.discount.discountAmt;
    }
}

class TxnPaymentRecordDBBHelper
{
    constructor(paymentData)
    {
        this.paymentTypeID = paymentData.paymentTypeID;
        this.amountPaid = paymentData.paidAmount;
    }
}

class TxnRecordDBHelper
{
    constructor(txnData)
    {
        this.txnNumber = txnData.txnNumber;
        this.userEmail = txnData.userEmail;
        
        let customer = txnData.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        if(customer)
            this.customerID = customer.custID;
        
        let couponList = txnData.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CouponLine);
        this.couponList = [];
        couponList.forEach(coupon => {
            this.couponList.push(new TxnCouponRecordDBHelper(coupon));
        });

        let itemList = txnData.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLineType);
        this.itemList = [];
        itemList.forEach(item => {
            this.couponList.push(new TxnItemRecordDBHelper(item));
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

    // READ 
    static async getLastTxn()            
    {
        const dbLastTxn = await TxnRecordDBModel.find().sort({ txnNumber: -1 }).limit(1);
        return dbLastTxn;
    }
    
}

module.exports.TxnItemRecordDBHelper = TxnItemRecordDBHelper;
module.exports.TxnCouponRecordDBHelper = TxnCouponRecordDBHelper;
module.exports.TxnPaymentRecordDBBHelper = TxnPaymentRecordDBBHelper;

module.exports.TxnRecordDBHelper = TxnRecordDBHelper;
module.exports.TxnRecordDBModel = TxnRecordDBModel;