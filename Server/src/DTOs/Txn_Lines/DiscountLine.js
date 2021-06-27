
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class DiscountLine extends TxnLine
{
    constructor(discountDesc, discountAmt, discountType = 0, qty = 1)
    {
        super();
        this.lineName = Constants.TxnLineName.DiscountLine;
        this.lineTypeID = Constants.TxnLineType.DiscountLine;

        this.discountDesc = discountDesc;
        this.discountUnitAmt = discountAmt;  
        this.discountType = discountType;  
        this.discountAmt = qty * discountAmt;
    }
}

module.exports.DiscountLine = DiscountLine;