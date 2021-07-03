
const express = require('express'); 
const router = express.Router();
const PaymentDBHelper = require('../dbCollections/PaymentDB').PaymentDBHelper;
const PaymentLine = require('../DTOs/Txn_Lines/PaymentLine').PaymentLine;
const Constants = require('../Constants').Constants;
const Utilities = require('../Utils/Utilities').Utilities;


router.use(express.json());

router.get('/getAllPayments/', async function(req,res)
{
    const routerName = "getAllPayments";
    try
    {
        process.posData.data.flowSuccess = false;
        let payments = await PaymentDBHelper.getAllPayments();
        
        if(!payments || payments.length < 1)
        {
            process.posData.data.errorMsg = "No Payment medias defined in DB!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }
            
        process.posData.data.payments = payments;
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = true;
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


router.post('/performPayment', async function(req,res)
{
    const routerName = "performPayment";
    try
    {
        process.posData.data.flowSuccess = false;
        let payment = await PaymentDBHelper.getPaymentById(req.body.paymentTypeID); 
        
        if(!payment)
        {
            process.posData.data.errorMsg = "Payment with given ID was not found!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }
        if(process.posData.data.posState < Constants.PosState.payState)
        {
            process.posData.data.errorMsg = "Please change State!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(500).send(process.posData);
            return;
        }
        let transaction = process.posData.txns[0];
        if(!transaction)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(500).send(process.posData);
            return;
        }

        let payRes = transaction.performPayment(payment , parseFloat(req.body.amountPaid));
        if(payRes.success)
        {
            process.posData.data.flowSuccess = true;
            process.posData.data.errorMsg = "";
        }
        else
        {
            process.posData.data.flowSuccess = false;
            process.posData.data.errorMsg = payRes.errMsg;
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
        }
        process.posData.txns[0] = transaction;
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