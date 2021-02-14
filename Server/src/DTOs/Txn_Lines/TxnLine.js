
const Constants = require('../../Constants').Constants;

class TxnLine
{
    constructor()
    {
        this.lineName = Constants.TxnLineName.TxnLine;
        this.lineTypeID = Constants.TxnLineType.TxnLine;
        
        this.lineNumber = 0;
    }
    
}

module.exports.TxnLine = TxnLine;