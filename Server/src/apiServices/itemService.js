
const express = require('express'); 
const router = express.Router();
const ItemDBHelper = require('../dbCollections/ItemDB').ItemDBHelper;
const ItemLine = require('../DTOs/Txn_Lines/ItemLine').ItemLine;
const Constants = require('../Constants').Constants;

router.use(express.json());

router.post('/getItems', async function(req,res)
{
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;

        var items = await ItemDBHelper.getItems(req.body);
        
        if(!items || items.length < 1)
        {
            process.posData.data.items = [];
            process.posData.data.errorMsg = "Item with given data was not found!";
            res.status(404).send(process.posData);
            return;
        }

        process.posData.data.items = items;
        process.posData.data.flowSuccess = true;
        process.posData.data.errorMsg = "";
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

router.post('/addItemTxn', async function(req,res)
{
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;
        
        var items = await ItemDBHelper.getItems(req.body);
        
        if(!items || items.length < 1)
        {
            process.posData.data.errorMsg = "Item with given data was not found!";
            res.status(404).send(process.posData);
            return;
        }

        let transaction = process.posData.txns[0];
        if(!transaction)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            res.status(500).send(process.posData);
            return;
        }

        let qty = 1;
        if(req.body.itemQty && req.body.itemQty != "")
            qty = parseInt(req.body.itemQty);
        let itemLine = new ItemLine(items[0], qty);
        
        transaction.AddLine(itemLine);
        process.posData.txns[0] = transaction;

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


router.post('/setItemQty', async function(req,res)
{
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;
        
        let transaction = process.posData.txns[0];
        if(!transaction)
        {
            res.status(500).send("Transaction is not defined!");
            return;
        }

        let itemObj = transaction.getObjFromLineNmbr(req.body.lineNumber)
        if(itemObj.lineTypeID != Constants.TxnLineType.ItemLine)
        {
            res.status(400).send("Selected Line is not an Item!");
            return;
        }
        
        if(req.body.itemQty && req.body.itemQty != "")
            qty = parseInt(req.body.itemQty);
        else    
        {
            res.status(400).send("Item Qty not set");
            return;
        }
        
        itemObj.setQty(qty);
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
        res.status(500).send(process.posData);
    }
    return;
});


router.post('/lineDiscount', async function(req,res)
{
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;
        
        let transaction = process.posData.txns[0];
        if(!transaction)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            res.status(500).send(process.posData);
            return;
        }

        let itemObj = transaction.getObjFromLineNmbr(req.body.lineNumber)
        if(itemObj.lineTypeID != Constants.TxnLineType.ItemLine)
        {
            process.posData.data.errorMsg = "Selected Line is not an Item!";
            res.status(400).send(process.posData);
            return;
        }
        
        if(!req.body.discountAmt)
        {
            process.posData.data.errorMsg = "Discount amount not defined!";
            res.status(400).send(process.posData);
            return;
        }
        
        discountAmt = parseFloat(req.body.discountAmt);
        itemObj.addLineDiscount(discountAmt);
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
        res.status(500).send(process.posData);
    }
    return;
});
module.exports = router;