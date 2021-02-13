
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class HeaderlLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = "HeaderlLine";
        this.lineTypeID = Constants.TxnLineType.headerLineType;
        
        this.description = "Txn Header";
    }
}

module.exports.HeaderlLine = HeaderlLine;