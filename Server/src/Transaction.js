
const fs = require('fs');

const HeaderLine = require('./DTOs/Txn_Lines/HeaderLine').HeaderLine;
const CustomerLine = require('./DTOs/Txn_Lines/CustomerLine').CustomerLine;
const CouponLine = require('./DTOs/Txn_Lines/CouponLine').CouponLine;
const PaymentDBHelper = require('./dbCollections/PaymentDB').PaymentDBHelper;
const CustomerDBHelper = require('./dbCollections/CustomerDB').CustomerDBHelper;
const ItemLine = require('./DTOs/Txn_Lines/ItemLine').ItemLine;
const DiscountLine = require('./DTOs/Txn_Lines/DiscountLine').DiscountLine;
const TotalLine = require('./DTOs/Txn_Lines/TotalLine').TotalLine;
const PaymentLine = require('./DTOs/Txn_Lines/PaymentLine').PaymentLine;
const Constants = require('./Constants').Constants;

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

    //#region "Refresh Txn functions" 
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
            if(item.discount && item.discount.discountAmt && item.discount.discountType != Constants.DiscType.redeemCoupon  
                && item.discount.discountType != Constants.DiscType.createCoupon)
                totalLine.discountAmt += item.discount.discountAmt;
        });
        
        discList.forEach(disc => {
            if(disc.discountType != Constants.DiscType.redeemCoupon 
                && disc.discountType != Constants.DiscType.createCoupon)
                totalLine.discountAmt += disc.discountAmt;
        });

        totalLine.discountAmt -= this.addCouponRedeemDiscs(totalLine.totalPrice);
        
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

    addCouponRedeemDiscs(totalAmt) 
    {
        let disc = 0;

        let redeemDiscList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.DiscountLine
                                    && x.discountType === Constants.DiscType.redeemCoupon);
        
        redeemDiscList.forEach(disc => {
            this.RemoveLine(disc);
        });

        let couponList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.CouponLine);
        couponList.forEach(coupon => {
            coupon.isUsed = false;
            
            if(totalAmt >= 3 * coupon.discountAmt)
            {
                coupon.isUsed = true;
                let discLine = new DiscountLine("Coupon discount", -1 * coupon.discountAmt, Constants.DiscType.redeemCoupon);
                this.txnList.push(discLine);
                
                totalAmt -= coupon.discountAmt;
                disc += coupon.discountAmt;
            }   
        });

        return disc;
    }
    //#endregion

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
        let discountLine = new DiscountLine("Manual Txn Discount", discountAmt, Constants.DiscType.manual);
        this.AddLine(discountLine);
    }
   
    //#region "End Txn functions" 

    addCustomerPoints()
    {
        let custLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.CustomerLine);
        if(custLine && custLine != null)
        {
            let addedPoints = 0;
            let calcPointAmout = this.amountPaid;
            let pointsItemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine
                                                        && x.itemType === Constants.ItemType.customerPoints);
            if(pointsItemList && pointsItemList != null && pointsItemList.length > 0)
            {
                pointsItemList.forEach(pointItem => {
                    addedPoints += pointItem.totalPrice
                    calcPointAmout -= addedPoints
                });
            }
    
            if(calcPointAmout>0)
                addedPoints += parseFloat(calcPointAmout/50);
            
            custLine.addPoints(addedPoints);
        }
        return;
    }

    createCoupon()
    {
        let couponAmt = 0;
        let couponDiscList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.DiscountLine
                                                    && x.discountType === Constants.DiscType.createCoupon);


        if(couponDiscList && couponDiscList != null && couponDiscList.length > 0)
        {
            couponDiscList.forEach(couponDisc => {
                couponAmt += couponDisc.discountAmt
            });
        }
        
        let couponItemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLine
            && x.discount && x.discount.discountType === Constants.DiscType.createCoupon);

        if(couponItemList && couponItemList != null && couponItemList.length > 0)
        {
            couponItemList.forEach(couponItem => {
                couponAmt += couponItem.discount.discountAmt
            });
        }

        if(couponAmt < 0) couponAmt = -1 * couponAmt;

        let footerLine = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.FooterLine);
        if(couponAmt > 0)
            return CouponLine.createCoupon(this.txnNumber,couponAmt);

        return null;
    }

    async saveToFile()
    {
        const fileName = "txn_" + String(this.txnNumber) 
        const dir = "./data/TxnFiles/" ;
        const path = dir + fileName + ".json";
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

    //#endregion
}


module.exports.Transaction = Transaction;