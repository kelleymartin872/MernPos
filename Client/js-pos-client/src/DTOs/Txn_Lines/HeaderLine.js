import TxnLine from './TxnLine'

export default class HeaderlLine extends TxnLine
{
    constructor()
    {
        super();
        this.description = "Txn Header";
    }
}