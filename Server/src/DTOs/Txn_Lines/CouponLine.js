
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class CouponLine extends TxnLine
{
    constructor(couponData,couponStatus)
    {
        super();
        this.lineName = Constants.TxnLineName.CouponLine;
        this.lineTypeID = Constants.TxnLineType.CouponLine;

        this.couponNmbr = couponData.couponNmbr;
        this.couponStatus = couponStatus;
        
        this.discount = new DiscountLine("Coupon discount", couponData.discountAmt);
    }
}

module.exports.CouponLine = CouponLine;