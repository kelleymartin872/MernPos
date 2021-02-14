
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class TotalLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = Constants.TxnLineName.TotalLine;
        this.lineTypeID = Constants.TxnLineType.TotalLine;
        
        this.totalPrice = 0;
        this.discountAmt = 0;
        this.finalPrice = 0;
    }
}

module.exports.TotalLine = TotalLine;