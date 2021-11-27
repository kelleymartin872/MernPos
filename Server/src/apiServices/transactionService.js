
const express = require('express'); 
const router = express.Router();

const TxnRecordDBHelper = require('../dbCollections/TxnRecordDB').TxnRecordDBHelper;
const Constants = require('../Constants').Constants;
const Transaction = require('../Transaction').Transaction;
const FooterLine = require('../DTOs/Txn_Lines/FooterLine').FooterLine;
const ReceiptGenerator = require('../Utils/ReceiptGenerator').ReceiptGenerator;
const Utilities = require('../Utils/Utilities').Utilities;

router.use(express.json());


router.post('/newTxn/', async function(req,res)
{
    const routerName = "newTxn";
    try
    {
        process.posData.data.flowSuccess = false;

        if(process.posData.data.posState == Constants.PosState.signedOff)
        {
            process.posData.data.errorMsg = "Please signIn!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(401).send(process.posData);
            return;
        }

        let lastTxn = await TxnRecordDBHelper.getLastTxn();
        let newTxnNmbr = 1
        
        if(lastTxn)
            newTxnNmbr =  lastTxn.txnNumber + 1;
        
        process.posData.data.posState = Constants.PosState.signedOn;

        let newTxn = new Transaction(newTxnNmbr);
        process.posData.txns = [newTxn];
        
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

router.post('/removeLine', async function(req,res)
{
    const routerName = "removeLine";
    try
    {
        let data = process.posData.data;
        let txn = process.posData.txns[0];
        process.posData.data.flowSuccess = false;

        if(!txn)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(500).send(process.posData);
            return;
        }
        data.selectedLineNmbr = req.body.selectedLineNmbr;
        let txnLine = txn.getObjFromLineNmbr(req.body.selectedLineNmbr);
        if(!txnLine)
        {
            process.posData.data.errorMsg = "Line with given lineNumber was not found!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }

        if( txnLine.lineTypeID === Constants.TxnLineType.ItemLine ||
            txnLine.lineTypeID === Constants.TxnLineType.CustomerLine ||
            txnLine.lineTypeID === Constants.TxnLineType.CouponLine ||
            txnLine.lineTypeID === Constants.TxnLineType.DiscountLine  )
        {
            txn.RemoveLine(txnLine);
        }
      
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

router.post('/changeState', async function(req,res)
{
    const routerName = "changeState";
    try
    {
        process.posData.data.flowSuccess = false;
        let targetState = req.body.state;

        if(!targetState || targetState<0 || targetState>3)
        {
            process.posData.data.errorMsg = "State Not Found";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(500).send(process.posData);
            return;
        }
        if(process.posData.txns.length < 1)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
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

        transaction.changeState(targetState);

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

router.post('/endTxn', async function(req,res)
{
    const routerName = "endTxn";
    try
    {
        let data = process.posData.data;
        let txns = process.posData.txns;
        let transaction = txns[0];

        if(!transaction)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(500).send(process.posData);
            return;
        }

        transaction.addCustomerPoints();
        transaction.AddLine(new FooterLine());
        let coupon = transaction.createCoupon();

        let txnDB = new TxnRecordDBHelper(transaction);
        TxnRecordDBHelper.pushMultiple([txnDB]);
        data.posState = Constants.PosState.signedOn;
        
        await transaction.saveToFile();
        let receiptMaker = new ReceiptGenerator(transaction.txnList, coupon);
        await receiptMaker.createPDF();

        process.posData.data = data;
        process.posData.txns[0] = transaction;

        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = true;


        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.flowSuccess = false;
        process.posData.data.errorMsg = ex.message;
        Utilities.logMsg(__filename, routerName, ex.stack);
        res.status(500).send(process.posData);
    }
    return;
});

router.post('/getReceipt', async function(req,res)
{
    const routerName = "endTxn";
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;

        var returnTxn = await TxnRecordDBHelper.getTxnByNmbr(parseInt(req.body.TxnNmbr));
        
        if(!returnTxn)
        {
            process.posData.data.flowSuccess = false;
            process.posData.data.errorMsg = "Txn was not found!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }

        if(process.posData.txns.length == 0)
            process.posData.txns.push({});
        if(process.posData.txns.length == 1)
            process.posData.txns.push(returnTxn);
        if(process.posData.txns.length == 2)
            process.posData.txns[1] = returnTxn;
        
        process.posData.data.flowSuccess = true;
        process.posData.data.errorMsg = "";
        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.errorMsg = ex.message;
        process.posData.data.flowSuccess = false;
        Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
        res.status(500).send(process.posData);
    }
    return;
});

function checkReturnDate(returnTxn, TxnDate)
{
    try
    {
        let dbYear = returnTxn.Date.getFullYear();
        let dbMonth = returnTxn.Date.getMonth();
        let dbDate = returnTxn.Date.getDate();

        let txnDateList = TxnDate.split('-');
        if(parseInt(txnDateList[0]) == dbYear
            && parseInt(txnDateList[1]) == dbMonth+1
            && parseInt(txnDateList[2]) == dbDate )
        {
            return true;    
        }
    }
    catch(e)
    {
        process.posData.data.errorMsg = e.message;
    }

    return false;
}

router.post('/returnReceipt', async function(req,res)
{
    const routerName = "returnReceipt";
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;
        let txns = process.posData.txns;
        let transaction = txns[0];

        var returnTxn = await TxnRecordDBHelper.getTxnByNmbr(parseInt(req.body.TxnNmbr));
        
        if(!returnTxn)
        {
            process.posData.data.flowSuccess = false;
            process.posData.data.errorMsg = "Txn was not found!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }
        if(!checkReturnDate(returnTxn, req.body.TxnDate))
        {
            process.posData.data.flowSuccess = false;
            process.posData.data.errorMsg = "Txn was not found!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }
        
        if(process.posData.txns.length == 0)
            process.posData.txns.push({});
        if(process.posData.txns.length == 1)
            process.posData.txns.push(returnTxn);
        if(process.posData.txns.length == 2)
            process.posData.txns[1] = returnTxn;
            
        let success = await transaction.performReturnReceipt(returnTxn);
        if(!success)
        {
            res.send(process.posData);
            return;
        }
        
        process.posData.data.flowSuccess = true;
        process.posData.data.errorMsg = "";
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

router.post('/totalDiscount', async function(req,res)
{
    const routerName = "returnReceipt";
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;
        
        let transaction = process.posData.txns[0];
        if(!transaction)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(500).send(process.posData);
            return;
        }
        
        if(!req.body.discountAmt)
        {
            process.posData.data.errorMsg = "Discount amount not defined!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(400).send(process.posData);
            return;
        }
        
        discountAmt = parseFloat(req.body.discountAmt);
        transaction.addTotalDiscount(discountAmt);
        transaction.refreshTxn();
        
        process.posData.txns[0] = transaction;
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

router.post('/abortTxn', async function(req,res)
{
    const routerName = "abortTxn";
    try
    {
        process.posData.data.flowSuccess = false;

        let lastTxn = await TxnRecordDBHelper.getLastTxn();
        let newTxnNmbr = 1
        
        if(lastTxn)
            newTxnNmbr =  lastTxn.txnNumber + 1;
        
        process.posData.data.posState = Constants.PosState.signedOn;

        let newTxn = new Transaction(newTxnNmbr);
        process.posData.txns = [newTxn];
        
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

module.exports = router;