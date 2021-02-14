
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class FooterLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = Constants.TxnLineName.FooterLine;
        this.lineTypeID = Constants.TxnLineType.FooterLine;
        
        this.description = "Txn Footer";
    }
}

module.exports.FooterLine = FooterLine;