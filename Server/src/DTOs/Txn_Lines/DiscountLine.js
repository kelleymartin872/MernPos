
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class DiscountLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = "DiscountLine";
        this.lineTypeID = Constants.TxnLineType.DiscountLineType;

        this.discID = "bday-disc";
        this.discDesc = "Bday discount";
        this.discount = -20;
    }
}

module.exports.DiscountLine = DiscountLine;