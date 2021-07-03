
const mongoose = require('mongoose');   // Connect to Mongo Database

const Constants = require('./src/Constants').Constants;

// db models

const ItemDBHelper = require('./src/dbCollections/ItemDB').ItemDBHelper;
const CustomerDBHelper = require('./src/dbCollections/CustomerDB').CustomerDBHelper;
const UserDBHelper = require('./src/dbCollections/UserDB').UserDBHelper;
const PaymentDBHelper = require('./src/dbCollections/PaymentDB').PaymentDBHelper;
const CouponDBHelper = require('./src/dbCollections/CouponDB').CouponDBHelper;

mongoose.connect('mongodb://localhost/MernPosDB', { useNewUrlParser: true , useUnifiedTopology: true } )
    .then(() => {
        console.log("Connected to MongoDB...")

        try
        {
            //#region "ItemDB" 

            var items = [ 
                new ItemDBHelper(111000 , 'Apple' , 55 , "AppleOff",  -5 ),
                new ItemDBHelper(111001 , 'Banana', 35  ),
                new ItemDBHelper(111002 , 'Mango' , 150 ,"SALE" , -30 ),
                new ItemDBHelper(111003 , 'Rice' , 45  ),
                new ItemDBHelper(111004 , 'Carrot' , 20 ),
                new ItemDBHelper(111005 , 'Chicken' , 400 , "100thAnniv" , -25 ),
                new ItemDBHelper(111006 , 'Wine', 350  ),
                new ItemDBHelper(111007 , 'Beer crate' , 650 , "Coupon", -40 , Constants.DiscType.createCoupon),
                new ItemDBHelper(111008 , 'Onion' , 130  ),
                new ItemDBHelper(111009 , 'Tomato' , 110 , "Markdown", -10 )
            ];

            ItemDBHelper.pushMultiple(items);

            //#endregion

            //#region "CustomerDB" 

            var customers = [
                new CustomerDBHelper('Tejas Jadhav' , 9930860936 ),
                new CustomerDBHelper('Mosh Hamedani', 9876543210 ),
                new CustomerDBHelper('Bruce Wayne', 9988776655 ),
                new CustomerDBHelper('Peter Parker' , 140995544 ),
                new CustomerDBHelper('Diana Prince' , 123456789 )
            ];

            CustomerDBHelper.pushMultiple(customers);

            //#endregion

            //#region "UserDB" 

            var users = [
                new UserDBHelper('tjadhav95@gmail.com','Tejas2304','Tejas Jadhav' ),
                new UserDBHelper('MoshHame@gmail.com','Mosh1234','Mosh Hamedani' )
            ];

            UserDBHelper.pushMultiple(users);

            //#endregion

            //#region "PaymentDB" 

            var payments = [
                new PaymentDBHelper(100,'INR' ),
                new PaymentDBHelper(201,'USD', 70 ),
                new PaymentDBHelper(202,'EUR', 88 ),
                new PaymentDBHelper(301,'VISA' ),
                new PaymentDBHelper(302,'MasterCard' ),
                new PaymentDBHelper(303,'AMEX' ),
                new PaymentDBHelper(401,'UPI' ),
                new PaymentDBHelper(402,'GPay' ),
                new PaymentDBHelper(403,'PayTM' ),
                new PaymentDBHelper(501,'Points' ),
                new PaymentDBHelper(601,'Voucher' )
            ];

            PaymentDBHelper.pushMultiple(payments);

            //#endregion

            console.log("DB data added successfully!");

        }
        catch(e)
        {
            console.log("Error in inserting data :: " , e);
        }
    })
    .catch(err => {
        console.log("Error Connecting to MongoDB :: " , err)
    });
