
import TotalLine from './Txn_Lines/TotalLine';
import ItemLine from './Txn_Lines/ItemLine'
import HeaderlLine from './Txn_Lines/HeaderLine';
import CustomerLine from './Txn_Lines/CustomerLine';
import Constants from '../Constants';

export default class Transaction
{
    constructor()
    { }

    static selectLine(txn, lineNumber)
    {
        this.unSelectAll(txn);
        let obj = this.getObjFromLineNmbr(txn,lineNumber);

        if(obj)
            obj.isSelected = true;
    }

    static unSelectAll(txn)
    {
        txn.txnList.forEach(txnLine => {
            txnLine.isSelected = false;
        });
    }

    static getObjFromLineNmbr(txn,lineNumber)
    {
        let obj = txn.txnList.find(obj => obj.lineNumber === lineNumber);
        return obj;
    }
 
}