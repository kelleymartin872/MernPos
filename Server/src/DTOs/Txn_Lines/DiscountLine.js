
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class DiscountLine extends TxnLine
{
    constructor(discountDesc, discountAmt)
    {
        super();
        this.lineName = Constants.TxnLineName.DiscountLine;
        this.lineTypeID = Constants.TxnLineType.DiscountLine;

        this.discountDesc = discountDesc;
        this.discountAmt = discountAmt;
    }
}

module.exports.DiscountLine = DiscountLine;