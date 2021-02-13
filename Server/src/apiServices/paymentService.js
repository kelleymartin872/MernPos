
const express = require('express'); 
const router = express.Router();
const PaymentDBHelper = require('../dbCollections/PaymentDB').PaymentDBHelper;

router.use(express.json());

router.get('/getAllPayments/', async function(req,res)
{
    const err = "No Payment medias defined in DB!";
    var payments = await PaymentDBHelper.getAllPayments();
    
    if(!payments || payments.length < 1)
        res.status(404).send(err);
    else
    { 
        res.send(payments);
    }
});

module.exports = router;