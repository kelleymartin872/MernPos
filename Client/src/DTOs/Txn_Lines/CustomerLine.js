import TxnLine from './TxnLine'
import Constants from '../../constants'

export default class CustomerLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineTypeID = Constants.TxnLineType.CustomerLineType;
        
        this.custID = "165137";
        this.custName = "Tejas Jadhav";
    }
}