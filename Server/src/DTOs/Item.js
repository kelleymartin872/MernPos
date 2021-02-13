
class Item
{
    constructor(itemId,itemName,itemPrice)
    {
        this.key = itemId;
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
    }
}

module.exports.Item = Item;