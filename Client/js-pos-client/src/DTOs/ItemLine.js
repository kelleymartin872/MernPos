
import Item from './Item'
import DiscountLine from './DiscountLine'

export default class ItemLine extends Item
{
    constructor(itemId,itemName,itemPrice)
    {
        super(itemId,itemName,itemPrice);
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