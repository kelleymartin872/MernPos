
import TotalLine from './Txn_Lines/TotalLine';
import ItemLine from './Txn_Lines/ItemLine'
import HeaderlLine from './Txn_Lines/HeaderLine';
import CustomerLine from './Txn_Lines/CustomerLine';
import Constants from '../constants';

export default class Transaction
{
    constructor()
    {
        let txnID = "1"
        this.key = txnID;
        this.txnID = txnID;
        this.userID = 0;
        
        this.txnList = [];
        this.txnList.push(new HeaderlLine());
        this.txnList.push(new CustomerLine());
        this.txnList.push(...this.fillItems());     // list of ItemLine
        
        this.txnList.push(new TotalLine());
        
        this.refreshTotal();
        this.refreshLineNmbrs();
    }

    refreshTotal()
    {
        let itemList = this.txnList.filter(x => x.lineTypeID === Constants.TxnLineType.ItemLineType);
        let total = this.txnList.find(x => x.lineTypeID === Constants.TxnLineType.TotalLineType);
        
        total.totalPrice = 0;
        total.discount = 0;
        
        itemList.forEach(item => {
            total.totalPrice += item.itemTotalPrice;
            total.discount += item.discount.discount;    
        });

        total.finalPrice = total.totalPrice + total.discount ;
        this.finalPrice = total.finalPrice;
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