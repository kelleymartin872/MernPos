
const Constants = require('../Constants').Constants;

class Data
{
    constructor()
    {
        this.flowSuccess = false;
        this.userEmail = "";
        this.selectedLineNmbr= -1;
        this.posState= Constants.PosState.signedOff;
    }
}

module.exports.Data = Data;