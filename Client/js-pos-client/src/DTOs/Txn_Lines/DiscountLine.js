import TxnLine from './TxnLine'

export default class DiscountLine extends TxnLine
{
    constructor()
    {
        super();
        this.discID = "bday-disc";
        this.discDesc = "Bday discount";
        this.discount = -20;
    }
}