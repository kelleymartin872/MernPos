
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
        
        this.itemType = Constants.ItemType.normal;
        if(qty > 0 && itemData.discountDesc && itemData.discountDesc != "" && itemData.discountAmt != 0)
        {
            this.discount = new DiscountLine(itemData.discountDesc,  itemData.discountAmt, itemData.discountType, qty);
        }
    }

    setQty(qty)
    {
        this.itemQty = qty;
        this.totalPrice  = this.itemQty * this.itemPrice;
        if(this.discount && this.discount.discountAmt != 0)
        {
            this.discount.discountAmt = this.discount.discountUnitAmt * qty
        }
        return;
    }

    setAsReturnItem(discountDesc,discountAmt)
    {
        if(this.itemQty < 0) 
            return;

        this.itemQty = -1 * this.itemQty;
        this.totalPrice  = this.itemQty * this.itemPrice;

        
        if(discountDesc != "" && discountAmt != 0)
        {
            this.discount = new DiscountLine(discountDesc,  discountAmt, this.itemQty);
        }

        return;
    }

    addLineDiscount(discountAmt)
    {
        this.discount = new DiscountLine("Manual Line Discount",  discountAmt,  Constants.DiscType.manual,  this.itemQty);
    }
}

module.exports.ItemLine = ItemLine;
