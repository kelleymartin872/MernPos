
const express = require('express'); 
const router = express.Router();
const CustomerDBHelper = require('../dbCollections/CustomerDB').CustomerDBHelper;
const CustomerLine = require('../DTOs/Txn_Lines/CustomerLine').CustomerLine;
const Constants = require('../Constants').Constants;

router.use(express.json());

router.get('/getCustomers/', async function(req,res)
{
    try
    {
        process.posData.data.flowSuccess = false;

        var customers = await CustomerDBHelper.getCustomers(req.body);
        
        if(!customers || customers.length < 1)
        {
            process.posData.data.errorMsg = "Customer with given Data was not found!";
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
        res.status(500).send(process.posData);
    }
    return;
});


router.post('/addCustomerTxn/', async function(req,res)
{
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;

        let customers = await CustomerDBHelper.getCustomers(req.body);
        let txn = process.posData.txns[0];

        if(!customers || customers.length < 1)
        {
            process.posData.data.errorMsg = "Customer with given Data was not found!";
            res.status(404).send(process.posData);
            return;
        }
        if(!txn)
        {
            process.posData.data.errorMsg = "Transaction is not defined!";
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
        res.status(500).send(process.posData);
    }
    return;
});


router.post('/addNewCustomer/', async function(req,res)
{
    try
    {
        process.posData.data.errorMsg = "";
        process.posData.data.flowSuccess = false;
        
        let customer = await CustomerDBHelper.getCustomerByPhoneNumber(req.body.phoneNumber);
        
        if(customer)
        {
            process.posData.data.errorMsg = "Customer with given phone number already exists.";
            res.status(400).send(process.posData);
            return;
        }

        var validation = CustomerDBHelper.validate(req.body); 
        if(validation.error)
        {
            res.status(400).send(err + validation.error.details[0].message);
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
        res.status(500).send(process.posData);
    }
    return;
});

module.exports = router;
