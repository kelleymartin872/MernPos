
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class HeaderLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = Constants.TxnLineName.HeaderLine;
        this.lineTypeID = Constants.TxnLineType.HeaderLine;
        
        this.description = "Txn Header";
    }
}

module.exports.HeaderLine = HeaderLine;