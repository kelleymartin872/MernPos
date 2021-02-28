
const express = require('express'); 
const router = express.Router();
const CouponDBHelper = require('../dbCollections/CouponDB').CouponDBHelper;
const CouponLine = require('../DTOs/Txn_Lines/CouponLine').CouponLine;
const Constants = require('../Constants').Constants;

router.use(express.json());

router.post('/addCouponTxn/', async function(req,res)
{
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;

        var coupon = await CouponDBHelper.getCouponByCouponNmbr(req.body.couponNmbr);
        
        if(!coupon)
        {
            process.posData.data.errorMsg = "Coupon with given Coupon number was not found!";
            res.status(404).send(process.posData);
            return;
        }
       
        if(!txn)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            res.status(500).send(process.posData);
            return;
        }

        let coupLine = new CustomerLine(coupon);
        txn.AddLine(coupLine);
        process.posData.txns[0] = txn;

        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = true;

        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        res.status(500).send(process.posData);
    }
    return;
});


module.exports = router;