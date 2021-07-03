
const mongoose = require('mongoose');   // Connect to Mongo Database
const { Constants } = require('../Constants');

const CouponModelSchema = new mongoose.Schema({
    couponNmbr: {type: String, required : true},
    couponStatus: {type: Number, required : true},
    discountAmt: {type: Number, required : true},
    expiryDate: {type: String, required : true},
    lastUpdateDate: { type: Date, default: Date.now }
});

const CouponDBModel = mongoose.model('Coupon' , CouponModelSchema);

class CouponDBHelper
{
    constructor(couponNmbr,discountAmt, expiryDate)
    {
        this.couponNmbr = couponNmbr;
        this.couponStatus = Constants.CouponStatus.created;
        this.discountAmt = discountAmt;
        this.expiryDate = expiryDate;
    }

    async insertToDB()
    {
        const dBObj = new CouponDBModel(this);
        const mongoResult = await dBObj.save();
        return;
    }

    static pushMultiple(elements)
    {
        for(var i = 0 ; i < elements.length ; i++)
        {
            elements[i].insertToDB();
        }   
    }
    
    static async getCouponByCouponNmbr(couponNmbr)            
    {
        let dbCoupons = await CouponDBModel.find();
        return dbCoupons.find(x => x.couponNmbr === couponNmbr);
    }

    static async updateCouponStatus(couponNmbr, status)
    {
        let dbCoupons = await CouponDBModel.find();
        let dbCoupon = dbCoupons.find(x => x.couponNmbr === couponNmbr);
        dbCoupon.couponStatus = parseInt(status);
        await dbCoupon.save();
    }
}

module.exports.CouponDBHelper = CouponDBHelper;
module.exports.CouponDBModel = CouponDBModel;
