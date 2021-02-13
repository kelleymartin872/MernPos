
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class CommentLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = "CommentLine";
        this.lineTypeID = Constants.TxnLineType.CommentLineType;
    }
}

module.exports.CommentLine = CommentLine;