
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class HeaderLine extends TxnLine
{
    constructor(txnNumber,userEmail)
    {
        super();
        this.lineName = Constants.TxnLineName.HeaderLine;
        this.lineTypeID = Constants.TxnLineType.HeaderLine;
        
        this.description = "Txn Header";
        this.txnNumber = txnNumber;
        this.userEmail = userEmail;
    }
}

module.exports.HeaderLine = HeaderLine;