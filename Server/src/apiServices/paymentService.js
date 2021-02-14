
const express = require('express'); 
const router = express.Router();
const PaymentDBHelper = require('../dbCollections/PaymentDB').PaymentDBHelper;
const PaymentLine = require('../DTOs/Txn_Lines/PaymentLine').PaymentLine;
const Constants = require('../Constants').Constants;


router.use(express.json());

router.get('/getAllPayments/', async function(req,res)
{
    try
    {
        const err = "No Payment medias defined in DB!";
        let payments = await PaymentDBHelper.getAllPayments();
        
        if(!payments || payments.length < 1)
            res.status(404).send(err);
        else
        { 
            res.send(payments);
        }
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});


router.post('/performPayment', async function(req,res)
{
    try
    {
        const err = "Payment with given ID was not found!";
        let payment = await PaymentDBHelper.getPaymentById(req.body.paymentTypeID); 
        
        if(!payment)
            res.status(404).send(err);
        else
        { 
            let payLine = new PaymentLine(payment , req.body.amountPaid);
            txn.AddLine(payLine);
            process.posData.txns[0] = txn;
            res.send(process.posData);
        }
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});


module.exports = router;