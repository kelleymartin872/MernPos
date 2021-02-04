
import TotalLine from './Txn_Lines/TotalLine';
import ItemLine from './Txn_Lines/ItemLine'
import HeaderlLine from './Txn_Lines/HeaderLine';
import CustomerLine from './Txn_Lines/CustomerLine';

export default class Transaction
{
    constructor()
    {
        let txnID = "1"
        this.key = txnID;
        this.txnID = txnID;
        
        this.header = new HeaderlLine();
        this.customer = new CustomerLine();

        this.total = new TotalLine();
        this.itemList = this.fillItems();
        this.refreshTotal();
    }

    refreshTotal()
    {
        this.total.totalPrice = 0;
        this.total.discount = 0;

        this.itemList.forEach(item => {
            this.total.totalPrice += item.itemTotalPrice;
            this.total.discount += item.discount.discount;    
        });

        this.total.finalPrice = this.total.totalPrice + this.total.discount ;
    }


    
    fillItems()
    {
        let items = [
            new ItemLine("1","Apples",100),
            new ItemLine("2","Mangos",200),
            new ItemLine("3","Carrots",35)
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