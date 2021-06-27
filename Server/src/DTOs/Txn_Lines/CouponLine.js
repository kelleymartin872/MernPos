
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;
const CouponDBHelper = require('./../../dbCollections/CouponDB').CouponDBHelper;
const DateToString = require('../../Utils/utilities').DateToString;

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

    static createCoupon(txnNumber, amt)
    {
        this.date = DateToString(new Date());

        let couponNmbr = "999" + txnNumber + this.date;
        let expiry = "" + (parseInt(this.date.substring(0,8)) + 10000);
        let couponDB = new CouponDBHelper(couponNmbr, amt, expiry);
        couponDB.insertToDB();
        return couponDB;
    }
}

module.exports.CouponLine = CouponLine;