
const express = require('express'); 
const router = express.Router();
const ItemDBHelper = require('../dbCollections/ItemDB').ItemDBHelper;

router.use(express.json());

router.get('/getItems', async function(req,res)
{
    const err = "Item with given ID was not found!";
    var items = await ItemDBHelper.getItems(req.body);
    
    if(!items || items.length < 1)
        res.status(404).send(err);
    else
    { 
        res.send(items);
    }
});

module.exports = router;