
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;
const DiscountLine = require('./DiscountLine').DiscountLine;

class ItemLine extends TxnLine
{
    constructor(itemData, qty=1)
    {
        if(!qty || qty==null)
            qty=1
            
        super();
        this.lineName = Constants.TxnLineName.ItemLine;
        this.lineTypeID = Constants.TxnLineType.ItemLine;
        
        this.itemId= itemData.itemId;
        this.itemName= itemData.itemName;
        this.itemPrice= itemData.itemPrice;
        
        this.itemQty = qty;
        this.totalPrice  = this.itemQty * this.itemPrice;
        
        if(qty > 0 && itemData.discountDesc && itemData.discountDesc != "" && itemData.discountAmt != 0)
        {
            this.discount = new DiscountLine(itemData.discountDesc,  itemData.discountAmt, qty);
        }
    }

    setQty(qty)
    {
        this.itemQty = qty;
        this.itemTotalPrice  = this.itemQty * this.itemPrice;
        if(this.discount && this.discount.discountAmt != 0)
        {
            this.discount.discountAmt = this.discount.discountUnitAmt * qty
        }
        return;
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

module.exports.ItemLine = ItemLine;
