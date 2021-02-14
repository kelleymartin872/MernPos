
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class CommentLine extends TxnLine
{
    constructor()
    {
        super();
        this.lineName = Constants.TxnLineName.CommentLine;
        this.lineTypeID = Constants.TxnLineType.CommentLine;
    }
}

module.exports.CommentLine = CommentLine;