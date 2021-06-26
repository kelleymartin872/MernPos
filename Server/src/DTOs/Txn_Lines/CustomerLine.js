
const Constants = require('../../Constants').Constants;
const TxnLine = require('./TxnLine').TxnLine;
const CustomerDB = require('../../dbCollections/CustomerDB').CustomerDBHelper;

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

    async addPoints(addedPoints)
    {
        await CustomerDB.updateCustomerPoints(this.custID, addedPoints);
        return;
    }
    
    async payPoints(paidAmt)
    {
        if(this.points < paidAmt)
            return false;
        let points = parseFloat(this.points - paidAmt);
        await CustomerDB.updateCustomerPoints(this.custID,points);
        return true;
    }
}

module.exports.CustomerLine = CustomerLine;