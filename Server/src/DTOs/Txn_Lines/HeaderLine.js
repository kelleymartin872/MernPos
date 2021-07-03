
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;
const Utilities = require('../../Utils/Utilities').Utilities;


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
    
        this.date = Utilities.DateToString(new Date());
    }
}

module.exports.HeaderLine = HeaderLine;