
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class PaymentLine extends TxnLine
{
    constructor(paymentTypeID, paymentName, amountPaid, payExchangeRate = 1)
    {
        super();
        this.lineName = "PaymentLine";
        this.lineTypeID = Constants.TxnLineType.PaymentLineType;
        
        this.paymentTypeID = paymentTypeID;
        this.paymentName = paymentName;
        this.amountPaid = amountPaid;
        this.payExchangeRate = payExchangeRate;
    }
}

module.exports.PaymentLine = PaymentLine;