
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
        const err = "Coupon with given Coupon number was not found!";
        var coupon = await CouponDBHelper.getCouponByCouponNmbr(req.body.couponNmbr);
        
        if(!coupon)
        {
            res.status(404).send(err);
            return;
        }
       
        if(!txn)
        {
            res.status(500).send("Ttansaction is not defined!");
            return;
        }

        let coupLine = new CustomerLine(coupon);
        txn.AddLine(coupLine);
        process.posData.txns[0] = txn;
        res.send(process.posData);
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});


module.exports = router;