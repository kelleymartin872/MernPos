import TxnLine from './TxnLine'
import Constants from '../../constants'

export default class PaymentLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineTypeID = Constants.TxnLineType.PaymentLineType;
        
        this.paymentType = "";
        this.amountPaid = 0;
        this.change = 0;
    }
}