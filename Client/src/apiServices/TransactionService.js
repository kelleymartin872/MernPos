
import Constants from '../Utils/Constants';
import ApiService from './ApiService';

export default class UserService
{
    constructor()
    {
        this.url = Constants.APIUrl.base + Constants.APIUrl.transactionService;
    }

    newTxn(reqObj={})
    {
        /* Request structure 
        reqObj = { };
        */
        const reqUrl = this.url + "newTxn";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }

    removeLine(reqObj={})
    {
        /* Request structure 
        reqObj = {
            "selectedLineNmbr":3
        };
        */
       
        const reqUrl = this.url + "removeLine";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }

    changeState(reqObj={})
    {
        /* Request structure 
        reqObj = {
            "state":3
        };
        */

        const reqUrl = this.url + "changeState";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }

    endTxn(reqObj={})
    {
        /* Request structure 
        reqObj = { };
        */

        const reqUrl = this.url + "endTxn";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }

    getReceipt(reqObj={})
    {
        /* Request structure
        reqObj = {
             "TxnNmbr": "11",
             "TxnDate": "2021-03-12"
        };
        */

        const reqUrl = this.url + "getReceipt";
        let apiService = new ApiService("POST", reqUrl , reqObj);
        return apiService.getResponse();
    }
    
    returnReceipt(reqObj={})
    {
        /* Request structure
        reqObj = {
            "TxnDate": "2021-03-04",
            "TxnNmbr": "11"
        };
        */

        const reqUrl = this.url + "returnReceipt";
        let apiService = new ApiService("POST", reqUrl , reqObj);
        return apiService.getResponse();
    }

    totalDiscount(reqObj={})
    {
        /* Request structure
        reqObj = {
            "discountAmt": 20.5
        };
        */

        const reqUrl = this.url + "totalDiscount";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }
    
    abortTxn(reqObj={})
    {
        /* Request structure 
        reqObj = { };
        */
        const reqUrl = this.url + "abortTxn";
        let apiService = new ApiService("POST", reqUrl , reqObj );
        return apiService.getResponse();
    }
}
