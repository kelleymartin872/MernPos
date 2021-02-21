
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
    let data = process.posData.data;
    if(!data.signedIn)
    {
        res.status(401).send("Please signIn!");
        return;
    }

    let lastTxn = await TxnRecordDBHelper.getLastTxn();
    let newTxnNmbr = 1
      
    if(!lastTxn)
    newTxnNmbr =  lastTxn.txnNumber + 1;
    
    data.posState = Constants.PosState.signedOn;

    let newTxn = new Transaction(newTxnNmbr);
    process.posData.data = data;
    process.posData.txns = [newTxn];
    
    res.send(process.posData);
  }
  catch(ex)
  {
      res.status(500).send(ex.message);
  }

});

router.post('/removeLine', async function(req,res)
{
  try
  {
      let data = process.posData.data;
      let txn = process.posData.txns[0];

      if(!txn)
      {
          res.status(500).send("Transaction is not defined!");
          return;
      }
      data.selectedLineNmbr = req.body.selectedLineNmbr;
      let txnLine = txn.getObjFromLineNmbr(req.body.selectedLineNmbr);

      if( txnLine.lineTypeID === Constants.TxnLineType.ItemLine ||
          txnLine.lineTypeID === Constants.TxnLineType.CustomerLine ||
          txnLine.lineTypeID === Constants.TxnLineType.CouponLine  )
          txn.RemoveLine(txnLine);
      
      process.posData.data = data;
      process.posData.txns[0] = txn;
      
      res.send(process.posData);
  }
  catch(ex)
  {
      res.status(500).send(ex.message);
  }
});


router.post('/changeState', async function(req,res)
{
    try
    {
        let data = process.posData.data;
        let txns = process.posData.txns;
        let targetState = req.body.state;

        if(!targetState || targetState<0 || targetState>3)
        {
            res.status(500).send("State Not Found");
            return;
        }
        
        if(txns.length < 1)
        {
            res.status(500).send("Transaction is not defined!");
            return;
        }
        let transaction = txns[0];
        if(!transaction)
        {
            res.status(500).send("Transaction is not defined!");
            return;
        }

        transaction.changeState(targetState);

        process.posData.data = data;
        process.posData.txns = txns;
        
        res.send(process.posData);
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
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
        
        res.send(process.posData);
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});

module.exports = router;