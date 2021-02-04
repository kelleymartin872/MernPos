import TxnLine from './TxnLine'

export default class TotalLine extends TxnLine
{
    constructor()
    {
        super();
        this.totalPrice = 0;
        this.discount = 0;
        this.finalPrice = 0;
    }
}