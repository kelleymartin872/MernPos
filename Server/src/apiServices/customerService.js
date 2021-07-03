
const express = require('express'); 
const router = express.Router();
const CustomerDBHelper = require('../dbCollections/CustomerDB').CustomerDBHelper;
const CustomerLine = require('../DTOs/Txn_Lines/CustomerLine').CustomerLine;
const ItemLine = require('../DTOs/Txn_Lines/ItemLine').ItemLine;
const Constants = require('../Constants').Constants;
const Utilities = require('../Utils/Utilities').Utilities;

router.use(express.json());

router.post('/getCustomers/', async function(req,res)
{
    const routerName = "getCustomers";
    try
    {
        process.posData.data.customers = [];
        process.posData.data.flowSuccess = false;

        var customers = await CustomerDBHelper.getCustomers(req.body);
        
        if(!customers || customers.length < 1)
        {
            process.posData.data.errorMsg = "Customer with given Data was not found!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }

        process.posData.data.customers = customers;
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


router.post('/addCustomerTxn/', async function(req,res)
{
    const routerName = "addCustomerTxn";
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;

        let customers = await CustomerDBHelper.getCustomers(req.body);
        let txn = process.posData.txns[0];

        if(!customers || customers.length < 1)
        {
            process.posData.data.errorMsg = "Customer with given Data was not found!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(404).send(process.posData);
            return;
        }
        if(!txn)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(500).send(process.posData);
            return;
        }
        
        let custLine = new CustomerLine(customers[0]);
        txn.AddLine(custLine);
        process.posData.txns[0] = txn;

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


router.post('/addNewCustomer/', async function(req,res)
{
    const routerName = "addNewCustomer";
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;
        
        let customer = await CustomerDBHelper.getCustomerByPhoneNumber(req.body.phoneNumber);
        
        if(customer)
        {
            process.posData.data.errorMsg = "Customer with given phone number already exists.";
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(400).send(process.posData);
            return;
        }

        var validation = CustomerDBHelper.validate(req.body); 
        if(validation.error)
        {
            process.posData.data.errorMsg = validation.error.details[0].message;
            Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
            res.status(400).send(process.posData);
            return;
        }

        let newCust = new CustomerDBHelper(req.body.custName , req.body.phoneNumber );
        newCust.insertToDB();

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


router.post('/addPoints/', async function(req,res)
{
    const routerName = "addPoints";
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

        let qty = 1;
        let custPointItem = {
            itemId : 100000,
            itemName: "Customer Points",
            itemPrice : parseFloat(req.body.points)
        }
        let itemLine = new ItemLine(custPointItem, qty);
        itemLine.custID = req.body.custID;
        this.itemType = Constants.ItemType.customerPoints;
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
        Utilities.logMsg(__filename, routerName, process.posData.data.errorMsg);
        res.status(500).send(process.posData);
    }
    return;
});


module.exports = router;
