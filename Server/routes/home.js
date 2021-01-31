
const express = require('express'); 
const router = express.Router();


router.get('/', function(req,res)
{
    //res.send('Hello World !!!');
    res.render('index', { title: "MyNodeApp" , message : "API Links - (ONLY GET)"} )
});

module.exports = router;
