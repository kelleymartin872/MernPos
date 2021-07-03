
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;
const Utilities = require('../../Utils/Utilities').Utilities;


class FooterLine extends TxnLine
{
    constructor(txnNumber,userEmail)
    {
        super();
        this.lineName = Constants.TxnLineName.FooterLine;
        this.lineTypeID = Constants.TxnLineType.FooterLine;
        
        this.description = "Thank you for shopping with us!";
        this.txnNumber = txnNumber;
        this.userEmail = userEmail;
        
        this.date = Utilities.DateToString(new Date());
    }
}

module.exports.FooterLine = FooterLine;