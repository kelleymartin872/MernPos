
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class TotalLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = "TotalLine";
        this.lineTypeID = Constants.TxnLineType.TotalLineType;
        
        this.totalPrice = 0;
        this.discount = 0;
        this.finalPrice = 0;
    }
}
module.exports.TotalLine = TotalLine;