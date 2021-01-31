
import TotalLine from './TotalLine';
import HeaderlLine from './HeaderLine';
import CustomerLine from './CustomerLine';

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
        this.itemList = [];
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
}