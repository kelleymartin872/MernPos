
const HeaderlLine = require('./Txn_Lines/HeaderLine').HeaderlLine;
const CustomerLine = require('./Txn_Lines/CustomerLine').CustomerLine;
const ItemLine = require('./Txn_Lines/ItemLine').ItemLine;
const TotalLine = require('./Txn_Lines/TotalLine').TotalLine;
const Constants = require('../Constants').Constants;

class Transaction
{
    constructor(data, txnNumber)
    {
        this.key = txnNumber;
        this.txnNumber = txnNumber;
        this.userID = data.userID;

        this.totalPrice = 0;
        this.discount = 0;
        this.finalPrice = this.totalPrice - this.discount;
        
        this.txnList = [];
        this.txnList.push(new HeaderlLine());

        //this.txnList.push(new CustomerLine());
        //this.txnList.push(...this.fillItems());     // list of ItemLine
        
        //this.txnList.push(new TotalLine());
        
        this.refreshLineNmbrs();
    }

    refreshTotal()
    {
        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLineType);
        let totalLine = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.TotalLineType);

        if(!totalLine)
        {
            totalLine = new TotalLine();
            this.txnList.push(totalLine);
        }
            
            
        totalLine.totalPrice = 0;
        totalLine.discount = 0;
        
        itemList.forEach(item => {
            totalLine.totalPrice += item.itemTotalPrice;
            totalLine.discount += item.discount.discount;    
        });

        totalLine.finalPrice = totalLine.totalPrice + totalLine.discount ;
        this.finalPrice = totalLine.finalPrice;
    }

    refreshLineNmbrs()
    {
        let i = 0
        this.txnList.forEach(txnLine => {
            i += 1;
            txnLine.lineNumber = i;
        });
    }
    
    makeSelection(lineNumber)
    {
        this.unSelectAll();
        let obj = this.getObjFromLineNmbr(lineNumber);
        if(obj)
            obj.isSelected = true;
    }

    unSelectAll()
    {
        this.txnList.forEach(txnLine => {
            txnLine.isSelected = false;
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
            this.RemoveFromList(cust);
        });
        
        if(this.txnList.length > 1)
            this.txnList.splice(1,0, custLine);
        else
            this.txnList.push(custLine);
        
        this.refreshLineNmbrs();
        return;
    }

    RemoveFromList(txnLine)
    {
        const index = this.txnList.indexOf(txnLine);
        if(index < 0)
            return;
        this.txnList.splice(index,1);
    }

    fillItems()
    {
        let items = [
            new ItemLine("1","Apples",80),
            new ItemLine("2","Mangos",120),
            new ItemLine("3","Carrots",35),
            new ItemLine("4","Rice",20),
            new ItemLine("5","Cheese",65)
        ];

        let i = 4;
        while(i < 6)
        {
            items.push(
                new ItemLine(i.toString(),"Apples",100)
            );
            i += 1;
        }

        return items;
    }
}


module.exports.Transaction = Transaction;