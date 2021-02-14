
const HeaderLine = require('./Txn_Lines/HeaderLine').HeaderLine;
const CustomerLine = require('./Txn_Lines/CustomerLine').CustomerLine;
const ItemLine = require('./Txn_Lines/ItemLine').ItemLine;
const TotalLine = require('./Txn_Lines/TotalLine').TotalLine;
const Constants = require('../Constants').Constants;

class Transaction
{
    constructor(txnNumber)
    {
        this.txnNumber = txnNumber;

        data = process.posData.data;

        this.userEmail = data.userEmail;
        this.posState = data.posState;

        this.totalPrice = 0;
        this.discountAmt = 0;
        this.finalPrice = 0;
        
        this.amountPaid = 0;
        this.amountOwed = 0;
        
        this.txnList = [];
        this.txnList.push(new HeaderLine());

        //this.txnList.push(new CustomerLine());
        //this.txnList.push(...this.fillItems());     // list of ItemLine
        
        //this.txnList.push(new TotalLine());
        
        this.refreshLineNmbrs();
    }

    refreshTxn()
    {
        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLineType);
        let couponList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CouponLine);
        let payList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.PaymentLine);
        let discList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.DiscountLine);

        let totalLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.TotalLineType);

        if(!totalLine)
        {
            totalLine = new TotalLine();
        }
        else
        {
            if(this.posState !== Constants.PosState.payState)
                this.RemoveLine(totalLine);
        }

        itemList.forEach(item => {
            totalLine.totalPrice += item.totalPrice;
            totalLine.discountAmt += item.discount.discount;    
        });
        
        couponList.forEach(coupon => {
            if(coupon.couponStatus === Constants.CouponStatus.reserved)
                totalLine.discountAmt += coupon.discount.discountAmt;
        });

        discList.forEach(disc => {
            totalLine.discountAmt += disc.discountAmt;
        });

        this.amountPaid = 0;
        payList.forEach(pay => {
            this.amountPaid = this.amountPaid + (pay.amountPaid * pay.payExchangeRate);
        });

        totalLine.finalPrice = totalLine.totalPrice + totalLine.discountAmt;
        
        this.totalPrice = totalLine.totalPrice;
        this.discountAmt = totalLine.discountAmt;
        this.finalPrice = totalLine.finalPrice;
        
        this.amountOwed = this.finalPrice - this.amountPaid;

        if(this.posState === Constants.PosState.payState)
        {
            this.txnList.push(totalLine);
        }

        this.refreshLineNmbrs();
        return;
    }

    refreshLineNmbrs()
    {
        let i = 0
        this.txnList.forEach(txnLine => {
            i += 1;
            txnLine.lineNumber = i;
        });
    }

    getObjFromLineNmbr(lineNumber)
    {
        let obj = {};
            
        this.txnList.forEach(txnLine => 
        {
            if(txnLine.lineNumber === lineNumber)
                obj = txnLine;
        });

        return obj;
    }

    AddCustomer(custLine)
    {
        this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CustomerLineType);
        
        let exisCusts = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CustomerLineType);
        
        exisCusts.forEach(cust => {
            this.RemoveLine(cust);
        });
        
        if(this.txnList.length > 1)
            this.txnList.splice(1,0, custLine);
        else
            this.txnList.push(custLine);
        
        this.refreshLineNmbrs();
        return;
    }

    AddLine(txnLine, index=-1)
    {
        if(index < 0 || this.txnList.length < index)
        {
            this.txnList.push(txnLine);
            return;
        }

        this.txnList.splice(index,0, txnLine);
        this.refreshTxn();

        return;
    }

    RemoveLine(txnLine)
    {
        const index = this.txnList.indexOf(txnLine);
        if(index < 0)
            return;
        this.txnList.splice(index,1);
    }

}


module.exports.Transaction = Transaction;