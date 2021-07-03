
const express = require('express'); 
const router = express.Router();
const CouponDBHelper = require('../dbCollections/CouponDB').CouponDBHelper;
const CouponLine = require('../DTOs/Txn_Lines/CouponLine').CouponLine;
const Constants = require('../Constants').Constants;
const Utilities = require('../Utils/Utilities').Utilities;

router.use(express.json());

router.post('/addCouponTxn/', async function(req,res)
{
    const routerName = "addCouponTxn";
    try
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = "";
        let txn = process.posData.txns[0];

        var coupon = await CouponDBHelper.getCouponByCouponNmbr(req.body.couponNmbr);
        
        if(!coupon)
        {
            process.posData.data.errorMsg = "Coupon with given Coupon number was not found!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }
       
        if(!txn)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }

        let coupLine = new CouponLine(coupon);
        let couponSuccess = coupLine.reserveCoupon(txn);
        process.posData.data.flowSuccess = couponSuccess.success;
        process.posData.data.errorMsg = couponSuccess.errorMsg;
        process.posData.txns[0] = txn;

        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
        res.status(500).send(process.posData);
    }
    return;
});


module.exports = router;