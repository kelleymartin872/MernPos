
const express = require('express'); 
const router = express.Router();
const ItemDBHelper = require('../dbCollections/ItemDB').ItemDBHelper;
const ItemLine = require('../DTOs/Txn_Lines/ItemLine').ItemLine;
const Constants = require('../Constants').Constants;

router.use(express.json());

router.get('/getItems', async function(req,res)
{
    try
    {
        const err = "Item with given data was not found!";
        var items = await ItemDBHelper.getItems(req.body);
        
        if(!items || items.length < 1)
            res.status(404).send(err);
        else
        {
            res.send(items);
        }
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});

router.post('/addItemTxn', async function(req,res)
{
    try
    {
        const err = "Item with given data was not found!";
        var items = await ItemDBHelper.getItems(req.body);
        
        if(!items || items.length < 1)
        {
            res.status(404).send(err);
            return;
        }
        let transaction = process.posData.txns[0];
        if(!transaction)
        {
            res.status(500).send("Transaction is not defined!");
            return;
        }

        let itemLine = new ItemLine(items[0], parseInt(req.body.itemQty));
        transaction.AddLine(itemLine);
        process.posData.txns[0] = transaction;
        res.send(process.posData);
    }
    catch(ex)
    {
        res.status(500).send(ex.message);
    }
});

module.exports = router;