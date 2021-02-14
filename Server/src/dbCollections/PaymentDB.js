
const mongoose = require('mongoose');   // Connect to Mongo Database
const Joi = require('joi');             // Request validation

const paymentDBSchema = new mongoose.Schema({
    paymentTypeID: {
        type: Number,
        required : true,
        unique: true
    },
    paymentName: {
        type: String,
        required : true
    },
    payExchangeRate: {
        type: Number
    }
});


const PaymentDBModel = mongoose.model('Payment' , paymentDBSchema);


class PaymentDBHelper
{
    constructor(paymentTypeID,paymentName, payExchangeRate = 1)
    {
        this.paymentTypeID = paymentTypeID;
        this.paymentName = paymentName;
        this.payExchangeRate = payExchangeRate;
    }

    async insertToDB()
    {
        const dBObj = new PaymentDBModel(this);
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
    static async getAllPayments()            
    {
        const dbPayments = await PaymentDBModel.find();
        return dbPayments;
    }

    static async getPaymentById(paymentTypeID)      
    {
        const dbPayments = await PaymentDBModel.find();
        return dbPayments.find(x => x.paymentTypeID === paymentTypeID);
    }
}

module.exports.PaymentDBHelper = PaymentDBHelper;
module.exports.PaymentDBModel = PaymentDBModel;