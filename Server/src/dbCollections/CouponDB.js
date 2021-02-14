
const mongoose = require('mongoose');   // Connect to Mongo Database
const { Constants } = require('../Constants');

const CouponModelSchema = new mongoose.Schema({
    couponNmbr: {type: Number, required : true},
    couponStatus: {type: Number, required : true},
    discountAmt: {type: Number, required : true},
    lastUpdateDate: { type: Date, default: Date.now }
});


const CouponDBModel = mongoose.model('Coupon' , CouponModelSchema);

class CouponDBHelper
{
    constructor(couponNmbr,discountAmt)
    {
        this.couponNmbr = couponNmbr;
        this.couponStatus = Constants.CouponStatus.created;
        this.discountAmt = discountAmt;
    }

    // INSERT 
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

}

module.exports.CouponDBHelper = CouponDBHelper;
module.exports.CouponDBModel = CouponDBModel;
