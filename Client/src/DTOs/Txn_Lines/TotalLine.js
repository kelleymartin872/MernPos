import TxnLine from './TxnLine'
import Constants from '../../Constants'

export default class TotalLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineTypeID = Constants.TxnLineType.TotalLineType;
        
        this.totalPrice = 0;
        this.discount = 0;
        this.finalPrice = 0;
    }
}