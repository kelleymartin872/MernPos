
const fs = require('fs');

const HeaderLine = require('../DTOs/Txn_Lines/HeaderLine').HeaderLine;
const CustomerLine = require('../DTOs/Txn_Lines/CustomerLine').CustomerLine;
const PaymentDBHelper = require('../dbCollections/PaymentDB').PaymentDBHelper;
const CustomerDBHelper = require('../dbCollections/CustomerDB').CustomerDBHelper;
const ItemLine = require('../DTOs/Txn_Lines/ItemLine').ItemLine;
const DiscountLine = require('../DTOs/Txn_Lines/DiscountLine').DiscountLine;
const TotalLine = require('../DTOs/Txn_Lines/TotalLine').TotalLine;
const PaymentLine = require('../DTOs/Txn_Lines/PaymentLine').PaymentLine;
const Constants = require('../Constants').Constants;

class Transaction
{
    constructor(txnNumber)
    {
        this.txnNumber = txnNumber;

        let data = process.posData.data;

        this.userEmail = data.userEmail;
        this.posState = data.posState;

        this.totalPrice = 0;
        this.discountAmt = 0;
        this.finalPrice = 0;
        
        this.amountPaid = 0;
        this.amountOwed = 0;
        
        this.txnList = [];
        this.txnList.push(new HeaderLine(this.txnNumber, this.userEmail));
        
        this.refreshLineNmbrs();
    }

    reOrderTxnList()
    {
        var tempTxn = [];
        tempTxn.push(this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine));
        let customerList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        if(customerList && customerList.length>0)
        {
            tempTxn.push(customerList[customerList.length - 1]);
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

    addRefreshTotalLine()
    {
        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine);
        let couponList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CouponLine);
        let payList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.PaymentLine);
        let discList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.DiscountLine);

        let totalLine = this.txnList.find(x => x.lineTypeID == Constants.TxnLineType.TotalLine)
        if(totalLine)
        {
            this.RemoveLine(totalLine);
        }
        else
        {
            totalLine = new TotalLine();
        }

        if(this.posState > Constants.PosState.itemState)
        {
            this.txnList.push(totalLine);
        }

        totalLine.totalPrice = 0;
        totalLine.discountAmt = 0;
        totalLine.finalPrice = 0;
        
        itemList.forEach(item => {
            totalLine.totalPrice += item.totalPrice;
            if(item.discount && item.discount.discountAmt)
                totalLine.discountAmt += item.discount.discountAmt;
        });
        
        couponList.forEach(coupon => {
            if(coupon.couponStatus === Constants.CouponStatus.reserved)
                totalLine.discountAmt += coupon.discount.discountAmt;
        });

        discList.forEach(disc => {
            totalLine.discountAmt += disc.discountAmt;
        });

        totalLine.totalPrice = parseFloat(totalLine.totalPrice.toFixed(2));
        totalLine.discountAmt = parseFloat(totalLine.discountAmt.toFixed(2));

        this.amountPaid = 0;
        payList.forEach(pay => {
            this.amountPaid = this.amountPaid + (pay.amountPaid * pay.payExchangeRate);
        });

        this.amountPaid = parseFloat(this.amountPaid.toFixed(2));
        totalLine.finalPrice = totalLine.totalPrice + totalLine.discountAmt;

        return totalLine;
    }

    refreshTxn()
    {
        let totalLine = this.addRefreshTotalLine();
        this.txnList = this.reOrderTxnList();

        this.totalPrice = totalLine.totalPrice;
        this.discountAmt = totalLine.discountAmt;
        this.finalPrice = totalLine.finalPrice;
        
        this.amountOwed = this.finalPrice - this.amountPaid;
        this.amountOwed = parseFloat(this.amountOwed.toFixed(2));

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

            if(this.posState === Constants.PosState.payState)
                this.mergeItems();
        
            this.refreshTxn();
            return true;
        }
        return false;
    }

    mergeItems()
    {
        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine);

        if(itemList.length < 2) 
            return;

        let i = 0;
        while(i < itemList.length - 1)
        {
            let iItem = itemList[i];

            let j = i + 1;
            while(j < itemList.length)
            {
                let jItem = itemList[j];
                if( iItem.itemId === jItem.itemId &&
                    iItem.itemPrice === jItem.itemPrice &&
                    Math.sign(iItem.itemQty) === Math.sign(jItem.itemQty)) 
                {
                    iItem.itemQty += jItem.itemQty;
                    itemList.splice(itemList.indexOf(jItem), 1);
                    this.RemoveLine(jItem);
                }
                else
                {
                    j += 1;
                }
            }   
            i += 1 ;
        }
    }

    async saveToFile()
    {
        const fileName = "txn_" + String(this.txnNumber) 
        const dir = "./TxnFiles/" ;
        const path = dir + fileName + ".json";;
        const data = {  };
        data[fileName] = this.txnList;

        if (!fs.existsSync(dir))
        { 
            fs.mkdir(dir, async (mkErr) => 
            { 
                if (mkErr)
                    console.error(mkErr);

                return fs.writeFile(path, JSON.stringify(data, null, 4), function (err) 
                {
                    if (err) throw err;
                });
            });
        }
        else
        { 
            return fs.writeFile(path, JSON.stringify(data, null, 4), function (err) 
            {
                if (err) throw err;
            });
        }
    }

    async performReturnReceipt(orgTxn)
    {
        let success = false;
        try
        {
            let headerLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.HeaderLine);
            headerLine.orgTxnNumber = orgTxn.txnNumber;

            orgTxn.itemList.forEach(item => {
                
                let itemData = {
                    itemId : item.itemId,
                    itemName : item.itemName,
                    itemPrice : item.totalPrice / item.itemQty,
                    discountDesc : item.discountDesc,  
                    discountAmt : item.discountAmt
                };

                let itemLine = new ItemLine(itemData, item.itemQty);
                itemLine.setAsReturnItem(itemData.discountDesc,itemData.discountAmt);
                this.AddLine(itemLine);
            });

            if(orgTxn.customerID && orgTxn.customerID != "")
            {
                var customer = await CustomerDBHelper.getCustomerByID(orgTxn.customerID);
                if(customer)
                {
                    let custLine = new CustomerLine(customer);
                    this.AddLine(custLine);
                }
            }

            this.refreshTxn();
            success = true;
        }
        catch(err) {
            success = false;
            console.error(err)
        }
        return success;
    }
    
    performPayment(payDB, amountPaid)
    {
        let payRes = {success:false, errMsg:""};
        try
        {
            if(payDB.paymentTypeID == Constants.PaymentType.Points)
            {
                let custLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
                if(custLine && custLine != null)
                {
                    payRes.success = this.payCustomerPoints(amountPaid);
                    if(!payRes.success)
                    {
                        payRes.errMsg = "Insufficient balance!";
                    }
                    else
                    {
                        let payLine = new PaymentLine(payDB, amountPaid);
                        this.AddLine(payLine);
                    }
                }
                else
                {
                    payRes.errMsg = "Please add a customer!";
                }
            }
            else
            {
                payRes.success = true;
                payRes.errMsg = "";
                let payLine = new PaymentLine(payDB , amountPaid);
                this.AddLine(payLine);
            }
        }
        catch(e)
        {
            payRes.errMsg = e.message;
        }
        return payRes;
    }

    addCustomerPoints()
    {
        let custLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        if(custLine && custLine != null)
        {
            custLine.addPoints(this.amountPaid);
        }
    }

    payCustomerPoints(amountPaid)
    {
        let custLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        if(custLine && custLine != null)
        {
            return custLine.payPoints(amountPaid);
        }
        return false;
    }
    
    addTotalDiscount(discountAmt)
    {
        let discountLine = new DiscountLine("Manual Txn Discount", discountAmt, 1);
        this.AddLine(discountLine);
    }
}


module.exports.Transaction = Transaction;