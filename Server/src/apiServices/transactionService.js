
const express = require('express'); 
const router = express.Router();

const TxnRecordDBHelper = require('../dbCollections/TxnRecordDB').TxnRecordDBHelper;
const Constants = require('../Constants').Constants;
const Transaction = require('../DTOs/Transaction').Transaction;
const FooterLine = require('../DTOs/Txn_Lines/FooterLine').FooterLine;

router.use(express.json());


router.post('/newTxn/', async function(req,res)
{
    try
    {
        process.posData.data.flowSuccess = false;

        if(process.posData.data.posState == Constants.PosState.signedOff)
        {
            process.posData.data.errorMsg = "Please signIn!";
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
        process.posData.data.errorMsg = ex.message;
        process.posData.data.flowSuccess = false;
        res.status(500).send(process.posData);
    }
    return;
});

router.post('/removeLine', async function(req,res)
{
  try
  {
        let data = process.posData.data;
        let txn = process.posData.txns[0];
        process.posData.data.flowSuccess = false;

        if(!txn)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            res.status(500).send(process.posData);
            return;
        }
        data.selectedLineNmbr = req.body.selectedLineNmbr;
        let txnLine = txn.getObjFromLineNmbr(req.body.selectedLineNmbr);
        if(!txnLine)
        {
            process.posData.data.errorMsg = "Line with given lineNumber was not found!";
            res.status(404).send(process.posData);
            return;
        }

        if( txnLine.lineTypeID === Constants.TxnLineType.ItemLine ||
            txnLine.lineTypeID === Constants.TxnLineType.CustomerLine ||
            txnLine.lineTypeID === Constants.TxnLineType.CouponLine  )
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
        res.status(500).send(process.posData);
    }
    return;
});


router.post('/changeState', async function(req,res)
{
    try
    {
        process.posData.data.flowSuccess = false;
        let targetState = req.body.state;

        if(!targetState || targetState<0 || targetState>3)
        {
            process.posData.data.errorMsg = "State Not Found";
            res.status(500).send(process.posData);
            return;
        }
        if(process.posData.txns.length < 1)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            res.status(500).send(process.posData);
            return;
        }
        let transaction = process.posData.txns[0];
        if(!transaction)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
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
        process.posData.data.errorMsg = ex.message;
        process.posData.data.flowSuccess = false;
        res.status(500).send(process.posData);
    }
    return;
});


router.post('/endTxn', async function(req,res)
{
    try
    {
        let data = process.posData.data;
        let txns = process.posData.txns;
        let transaction = txns[0];

        if(!transaction)
        {
            res.status(500).send("Transaction is not defined!");
            return;
        }

        transaction.AddLine(new FooterLine());
        let txnDB = new TxnRecordDBHelper(transaction);
        TxnRecordDBHelper.pushMultiple([txnDB]);
        data.posState = Constants.PosState.signedOn;
        
        process.posData.data = data;
        process.posData.txns[0] = transaction;

        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = true;

        transaction.saveToFile();

        res.send(process.posData);
    }
    catch(ex)
    {
        process.posData.data.errorMsg = ex.message;
        process.posData.data.flowSuccess = false;
        res.status(500).send(process.posData);
    }
    return;
});

router.post('/getReceipt', async function(req,res)
{
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;

        var returnTxn = await TxnRecordDBHelper.getTxnByNmbr(parseInt(req.body.TxnNmbr));
        
        if(!returnTxn)
        {
            process.posData.data.flowSuccess = false;
            process.posData.data.errorMsg = "Txn was not found!";
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
        res.status(500).send(process.posData);
    }
    return;
});


router.post('/returnReceipt', async function(req,res)
{
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
        process.posData.data.errorMsg = ex.message;
        process.posData.data.flowSuccess = false;
        res.status(500).send(process.posData);
    }
    return;
});


module.exports = router;