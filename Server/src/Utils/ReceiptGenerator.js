
var fs = require("fs");
var path = require("path");
const Constants  = require("../Constants").Constants;
var Handlebars = require("handlebars");
var pdf = require("html-pdf");
var QRCode  = require("qrcode");

class ReceiptGenerator 
{
    constructor(txnList,coupon)
    {
        this.html = fs.readFileSync(path.join(__dirname, "./receiptPDF.html"), "utf8");
        this.options = {
            format: "A5",
            orientation: "portrait",
            border: "10mm",
          };
        this.coupon = coupon;
        this.txnList = txnList;
        
        this.setFilename();
        this.setData();
        
        this.document = {
            html: this.html,
            data: this.data ,
            path: "./data/TxnReceipts/"+this.fileName ,
            type: "" // "stream" || "buffer" || "" ("" defaults to pdf)
          };
        
        this.setHelpers();
    }
    
    setFilename()
    {
        const taHeader = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine);
        this.fileName = "txnReceipt_" + String(taHeader.txnNumber) + ".pdf";
    }

    async setData()
    {
        this.data = {};
        this.data.txnList = this.txnList;
        let headerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine);
        if(headerLine)
            headerLine.isHeaderLine = true;

        let customerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        if(customerLine)
            customerLine.isCustomerLine = true;

        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine);
        let firstItemFound = false;
        itemList.forEach(item => {
            item.isItemLine = true;
            if(!firstItemFound)
            {
                item.isFirstItemLine = true;
                firstItemFound = true;
            }   
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
        if(totalLine)
            totalLine.isTotalLine = true;
        
        let payList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.PaymentLine);
        payList.forEach(pay => {
            pay.isPaymentLine = true;
        });        

        let footerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.FooterLine);
        if(footerLine)
        {
            footerLine.isFooterLine = true;
        }

        return;
    }

    setHelpers()
    {
        this.document.helper = [];
        this.document.helper.push({name:"toFixed", function : (number,places) => {
            return number.toFixed(places);
        }});
        
        this.document.helper.push({name:"toDateStr", function : (str) => {
            let dateStr = str.substring(6, 8) + ":" + str.substring(4, 6) + ":" + str.substring(0, 4) ;

            if(str.length > 8)
                dateStr += " / " + str.substring(8, 10) + ":" + str.substring(10, 12);

            return dateStr;
        }});

    }

    createCouponData()
    {
        return new Promise((resolve, reject) => {
            
            if(this.coupon && this.coupon.couponNmbr && this.coupon.couponNmbr!="")
            {
                QRCode.toDataURL(this.coupon.couponNmbr.toString()).then(qrdata => {
                    this.document.data.isCoupon = true;
                    this.document.data.coupon = this.coupon;
                    this.document.data.coupon.triggerAmt = this.coupon.discountAmt * 3;
                    this.document.data.coupon.QRdata = qrdata;

                    resolve(true);
                });
            }
            else 
            {
                this.document.data.isCoupon = false;
                resolve(false);
            }
        });
    }

    createPDF()
    {
        return new Promise((resolve, reject) => {
            // use helpers
            if(this.document.helper)
            {
                this.document.helper.forEach(element => {
                    Handlebars.registerHelper(element.name, element.function);
                });
            }

            this.createCouponData().then(() => {
                var html = Handlebars.compile(this.document.html)(this.document.data);

                pdf.create(html, this.options).toFile(this.document.path, (err, res) => {
                    if (!err) resolve(res);
                    else reject(err);
                });
            });
        });
    }
}

module.exports.ReceiptGenerator = ReceiptGenerator;