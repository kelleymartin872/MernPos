
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

    reOrderTxnList()
    {

        var tempTxn = [];
        tempTxn.push(this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine));
        let customerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        if(customerLine)
        {
            tempTxn.push(customerLine);
        }

        
        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine);
        itemList.forEach(item => {
            tempTxn.push(item);
        });

        let couponList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CouponLine);
        couponList.forEach(coupon => {
            tempTxn.push(coupon);
        });

        let discList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.DiscountLine);
        discList.forEach(disc => {
            tempTxn.push(disc);
        });

        let totalLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.TotalLine);
        if(totalLine)
        {
            tempTxn.push(totalLine);
        }
        
        let payList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.PaymentLine);
        payList.forEach(pay => {
            tempTxn.push(pay);
        });

        let footerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.FooterLine);
        if(footerLine)
        {
            tempTxn.push(footerLine);
        }
        return tempTxn;
    }

    refreshTxn()
    {
        this.txnList = this.reOrderTxnList();

        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine);
        let couponList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CouponLine);
        let payList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.PaymentLine);
        let discList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.DiscountLine);

        let totalLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.TotalLine);
        
        if(!totalLine)
        {
            totalLine = new TotalLine();
            if(this.posState > Constants.PosState.itemState)
            {
                this.txnList.push(totalLine);
            }
        }
        else
        {
            if(this.posState !== Constants.PosState.payState)
                this.RemoveLine(totalLine);
        }

        itemList.forEach(item => {
            totalLine.totalPrice += item.totalPrice;
            totalLine.discountAmt += item.discount.discountAmt;    
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

    AddLine(txnLine, index=-1)
    {
        if(index < 0 || this.txnList.length < index)
        {
            this.txnList.push(txnLine);
        }
        else
        {
            this.txnList.splice(index,0, txnLine);
        }

        this.refreshTxn();

        if(this.posState === Constants.PosState.signedOn)
        {
            this.changeState(Constants.PosState.itemState);
        }   

        return;
    }

    RemoveLine(txnLine)
    {
        const index = this.txnList.indexOf(txnLine);
        if(index < 0)
            return;
        this.txnList.splice(index,1);
    }

    changeState(targetState)
    {
        if(this.posState !== targetState)
        {
            this.posState = targetState;
            process.posData.data.posState = targetState;
            this.refreshTxn();
            return true;
        }
        return false;
    }
}


module.exports.Transaction = Transaction;