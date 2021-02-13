
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class CouponLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = "CouponLine";
        this.lineTypeID = Constants.TxnLineType.CouponLineType;
    }
}

module.exports.CouponLine = CouponLine;