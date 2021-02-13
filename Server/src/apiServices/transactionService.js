
const express = require('express'); 
const router = express.Router();
const TxnRecordDBHelper = require('../dbCollections/TxnRecordDB').TxnRecordDBHelper;
const Transaction = require('../DTOs/Transaction').Transaction;

router.use(express.json());


router.post('/getNewTransaction/', async function(req,res)
{
    let lastTxn = await TxnRecordDBHelper.getLastTxn();
    let newTxnNmbr = 1
    
    if(!lastTxn)
      newTxnNmbr =  lastTxn.txnNumber + 1;

    let newTxn = new Transaction(newTxnNmbr);
    process.posData.data = [];
    process.posData.txns = [newTxn];
    
    res.send(process.posData);

});

module.exports = router;