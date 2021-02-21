import TxnLine from './TxnLine'
import Constants from '../../Constants'

export default class HeaderlLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineTypeID = Constants.TxnLineType.headerLineType;
        
        this.description = "Txn Header";
    }
}