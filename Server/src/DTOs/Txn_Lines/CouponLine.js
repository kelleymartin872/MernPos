
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;
const CouponDBHelper = require('./../../dbCollections/CouponDB').CouponDBHelper;
const Utilities = require('../../Utils/Utilities').Utilities;

class CouponLine extends TxnLine
{
    constructor(couponDB)
    {
        super();
        this.lineName = Constants.TxnLineName.CouponLine;
        this.lineTypeID = Constants.TxnLineType.CouponLine;

        this.couponNmbr = couponDB.couponNmbr;
        this.couponStatus = couponDB.couponStatus;
        this.expiryDate = couponDB.expiryDate;
        
        this.isUsed = false;
        this.discountAmt = couponDB.discountAmt;
    }

    reserveCoupon(txn)
    {
        let ret = {success : false, errorMsg:""};
        
        if(this.couponStatus == Constants.CouponStatus.reserved)
        {
            ret.success = false;
            ret.errorMsg = "This Coupon is already reserved!";
            return ret;
        }
        if(this.couponStatus == Constants.CouponStatus.redeemed)
        {
            ret.success = false;
            ret.errorMsg = "This Coupon is already reserved!";
            return ret;
        }
        if(this.expiryDate)
        {
            let date = Utilities.DateToString(new Date()).substring(0,8);
            if(date != this.expiryDate)
            {
                let dateSorted = [date,this.expiryDate].sort();
                if(dateSorted[0] === this.expiryDate)
                {
                    ret.success = false;
                    ret.errorMsg = "This Coupon is expired!";
                    return ret;
                }
            }
        }

        txn.AddLine(this);
        this.couponStatus = Constants.CouponStatus.reserved;
        CouponDBHelper.updateCouponStatus(this.couponNmbr, this.couponStatus);
        
        ret.success = true;
        
        return ret;
    }
    
    redeemCoupon(txn)
    {
        let ret = {success : false, errorMsg:""};
        
        this.couponStatus = Constants.CouponStatus.redeemed;
        CouponDBHelper.updateCouponStatus(this.couponNmbr, this.status);
        ret.success = true;
        
        return ret;
    }

    static createCoupon(txnNumber, amt)
    {
        let date = Utilities.DateToString(new Date());

        let couponNmbr = "999" + txnNumber + date;
        let expiry = "" + (parseInt(date.substring(0,8)) + 10000);
        let couponDB = new CouponDBHelper(couponNmbr, amt, expiry);
        couponDB.insertToDB();
        return couponDB;
    }
}

module.exports.CouponLine = CouponLine;