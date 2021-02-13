
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class FooterLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = "FooterLine";
        this.lineTypeID = Constants.TxnLineType.FooterLineType;
        this.description = "Txn Footer";
    }
}

module.exports.FooterLine = FooterLine;