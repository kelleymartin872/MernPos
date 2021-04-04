var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");
const Constants  = require("../Constants").Constants;

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
        const taHeader = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine);
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
        return new Promise((resolve,reject) => {
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

module.exports.ReceiptGenerator = ReceiptGenerator;