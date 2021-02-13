
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
        const err = "Customer with given Data was not found!";
        var customers = await CustomerDBHelper.getCustomers(req.body);
        
        if(!customers || customers.length < 1)
            res.status(404).send(err);
        else
        { 
            res.send(customers);
        }
    }
    catch(ex)
    {
        res.staus(500).send(ex);
    }
});


router.post('/addCustomerTxn/', async function(req,res)
{
    try
    {
        const err = "Customer with given Data was not found!";
        let customers = await CustomerDBHelper.getCustomers(req.body);
        let txn = process.posData.txns[0];

        if(!customers || customers.length < 1)
            res.status(404).send(err);
        else
        { 
            let custLine = new CustomerLine(customers[0]);
            txn.AddCustomer(custLine);
            process.posData.txns[0] = txn;
            res.send(process.posData);
        }
    }
    catch(ex)
    {
        res.staus(500).send(ex);
    }
});

router.post('/delCustomerTxn/', async function(req,res)
{
    try
    {
        const err = "No Customer in Txn!";
        var customers = await CustomerDBHelper.getCustomers(req.body);
        let txn = process.posData.txns[0];

        let exisCusts = txn.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CustomerLineType);
            
        if(!exisCusts || exisCusts.length < 1)
            res.status(404).send(err);
        else
        { 
            exisCusts.forEach(cust => {
                txn.RemoveFromList(cust);
            });
            res.send(process.posData);
        }
    }
    catch(ex)
    {
        res.staus(500).send(ex);
    }

});


router.post('/addNewCustomer/', async function(req,res)
{
    try
    {
        const err = "Error! ";
        let customer = await CustomerDBHelper.getCustomerByPhoneNumber(req.body.phoneNumber);
        
        if(customer)
        {            
            res.status(400).send(err + "Customer with given phone number already exists.");
            return
        }
        if(!req.body.custName || req.body.custName.length < 3)
        {
            res.status(400).send(err + "Customer Name min length 3 required.");
            return
        }
        if(!/^\d+$/.test(req.body.phoneNumber))
        {            
            res.status(400).send(err + "Customer Phone number should only contain numbers.");
            return
        }
        if(!req.body.phoneNumber || req.body.phoneNumber.length < 8)
        {            
            res.status(400).send(err + "Customer Phone number min length 8 required.");
            return
        }

        let newCust = new CustomerDBHelper(req.body.custName , req.body.phoneNumber );
        newCust.insertToDB()
        res.send("New Customer has been added to DB");
    }
    catch(ex)
    {
        res.status(500).send(ex);
    }
});

module.exports = router;