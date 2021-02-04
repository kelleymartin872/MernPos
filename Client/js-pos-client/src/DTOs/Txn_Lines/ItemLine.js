
import TxnLine from './TxnLine'
import DiscountLine from './DiscountLine'

export default class ItemLine extends TxnLine
{
    constructor(itemId,itemName,itemPrice)
    {
        super();
        
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemQty = 1;
        this.itemTotalPrice  = this.itemQty * this.itemPrice;

        this.addQty = this.addQty.bind(this);
        this.removeQty = this.removeQty.bind(this);
        
        this.discount = new DiscountLine();
    }
    addQty()
    {
        this.itemQty += 1;
        this.itemTotalPrice += this.itemPrice;

    }
    removeQty()
    {
        if(this.itemQty < 1) 
            return;
        this.itemQty -= 1;
        this.itemTotalPrice = this.itemQty * this.itemPrice;
    }

    addDiscount()
    {
        this.discount -= 10;
    }
}