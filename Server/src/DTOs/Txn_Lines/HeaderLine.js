
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;
const DateToString = require('../../Utils/utilities').DateToString;


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
    
        this.date = DateToString(new Date());
    }
}

module.exports.HeaderLine = HeaderLine;