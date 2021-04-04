var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");
const { Constants } = require("../Constants");
const { resolve } = require("path");

class ReceiptGenerator 
{
    constructor(txnList)
    {
        
        this.html = fs.readFileSync(path.join(__dirname, "./receiptPDF.html"), "utf8");
        this.options = {
            format: "A5",
            orientation: "portrait",
            border: "10mm",
          };
        this.txnList = txnList;
        
        this.setFilename();
        this.setData();
        
        this.document = {
            html: this.html,
            data: this.data ,
            path: "./TxnReceipts/"+this.fileName ,
            type: "" // "stream" || "buffer" || "" ("" defaults to pdf)
          };
    }
    
    setFilename()
    {
        const taHeader = this.txnList.find(x => x.lineTypeID == Constants.TxnLineType.HeaderLine);
        this.fileName = "txnReceipt_" + String(taHeader.txnNumber) + ".pdf";
    }

    setData()
    {
        this.data = {};
        this.data.txnList = this.txnList;
        let headerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine);
        headerLine.isHeaderLine = true;

        let customerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        customerLine.isCustomerLine = true;

        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine);
        itemList.forEach(item => {
            item.isItemLine = true;
            if(item.discount && item.discount.discountAmt && item.discount.discountAmt !== 0 )
                item.hasDiscount = true;
        });
        
        let couponList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CouponLine);
        couponList.forEach(coupon => {
            coupon.isCouponLine = true;
        });
        
        let discList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.DiscountLine);
        discList.forEach(disc => {
            disc.isDiscountLine = true;
        });        

        let totalLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.TotalLine);
        totalLine.isTotalLine = true;
        
        let payList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.PaymentLine);
        payList.forEach(pay => {
            pay.isPaymentLine = true;
        });        

        let footerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.FooterLine);
        footerLine.isFooterLine = true;

        return;
    }

    createPDF()
    {
        this.document.helpers = [];
        return new Promise( (resolve,reject) => {
            pdf.create(this.document, this.options)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}


const txnList = [
    {
        "lineName": "HeaderlLine",
        "lineTypeID": 1,
        "lineNumber": 1,
        "description": "Txn Header",
        "txnNumber": 32,
        "userEmail": "tjadhav95@gmail.com"
    },
    {
        "lineName": "CustomerLine",
        "lineTypeID": 2,
        "lineNumber": 2,
        "custID": "123456789",
        "custName": "Diana Prince",
        "phoneNumber": 123456789,
        "points": 3.6
    },
    {
        "lineName": "ItemLine",
        "lineTypeID": 3,
        "lineNumber": 3,
        "itemId": "111001",
        "itemName": "Banana",
        "itemPrice": 35,
        "itemQty": 1,
        "totalPrice": 35
    },
    {
        "lineName": "ItemLine",
        "lineTypeID": 3,
        "lineNumber": 4,
        "itemId": "111009",
        "itemName": "Tomato",
        "itemPrice": 110,
        "itemQty": 1,
        "totalPrice": 110,
        "discount": {
            "lineName": "DiscountLine",
            "lineTypeID": 4,
            "lineNumber": 0,
            "discountDesc": "Markdown",
            "discountUnitAmt": -10,
            "discountAmt": -10
        }
    },
    {
        "lineName": "ItemLine",
        "lineTypeID": 3,
        "lineNumber": 5,
        "itemId": "111009",
        "itemName": "Tomato",
        "itemPrice": 110,
        "itemQty": 1,
        "totalPrice": 110,
        "discount": {
            "lineName": "DiscountLine",
            "lineTypeID": 4,
            "lineNumber": 0,
            "discountDesc": "Markdown",
            "discountUnitAmt": -10,
            "discountAmt": -10
        }
    },
    {
        "lineName": "TotalLine",
        "lineTypeID": 7,
        "lineNumber": 6,
        "totalPrice": 255,
        "discountAmt": -20,
        "finalPrice": 235
    },
    {
        "lineName": "PaymentLine",
        "lineTypeID": 8,
        "lineNumber": 7,
        "paymentTypeID": 302,
        "paymentName": "MasterCard",
        "amountPaid": 235,
        "payExchangeRate": 1
    },
    {
        "lineName": "FooterLine",
        "lineTypeID": 9,
        "lineNumber": 8,
        "description": "Thank you for shopping with us!"
    }
];

let receipt = new ReceiptGenerator(txnList);
receipt.createPDF();
