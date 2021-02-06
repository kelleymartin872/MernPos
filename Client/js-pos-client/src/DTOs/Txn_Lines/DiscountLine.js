import TxnLine from './TxnLine'
import Constants from '../../constants'

export default class DiscountLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineTypeID = Constants.TxnLineType.DiscountLineType;

        this.discID = "bday-disc";
        this.discDesc = "Bday discount";
        this.discount = -20;
    }
}