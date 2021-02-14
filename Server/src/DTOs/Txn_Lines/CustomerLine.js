
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;

class CustomerLine extends TxnLine
{
    constructor(custData)
    {
        super();
        this.lineName = Constants.TxnLineName.CustomerLine;
        this.lineTypeID = Constants.TxnLineType.CustomerLine;
        
        this.custID = custData.custID;
        this.custName = custData.custName;
        this.phoneNumber = custData.phoneNumber;
        this.points = custData.points;
    }
}

module.exports.CustomerLine = CustomerLine;