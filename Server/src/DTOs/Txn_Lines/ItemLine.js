
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;
const DiscountLine = require('./DiscountLine').DiscountLine;

class ItemLine extends TxnLine
{
    constructor(itemId,itemName,itemPrice,discountDesc="",discountAmt=0)
    {
        super();
        this.lineName = "ItemLine";
        this.lineTypeID = Constants.TxnLineType.ItemLineType;
        
        this.itemId= itemId;
        this.itemName= itemName;
        this.itemPrice= itemPrice;
        
        this.itemQty = 1;
        this.itemTotalPrice  = this.itemQty * this.itemPrice;
        
        if(discountDesc!="" && discountAmt > 0)
        {
            this.discount = new DiscountLine(discountDesc, discountAmt);
        }
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

module.exports.ItemLine = ItemLine;
