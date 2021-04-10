
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class PaymentLine extends TxnLine
{
    constructor(paymentData, amountPaid)
    {
        super();
        this.lineName = Constants.TxnLineName.PaymentLine;
        this.lineTypeID = Constants.TxnLineType.PaymentLine;
        
        this.paymentTypeID = paymentData.paymentTypeID;
        this.paymentName = paymentData.paymentName;
        this.amountPaid = amountPaid;
        this.payExchangeRate = paymentData.payExchangeRate;
        this.amountPaidINR = this.amountPaid * this.payExchangeRate
    }
}

module.exports.PaymentLine = PaymentLine;