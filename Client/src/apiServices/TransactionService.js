
import Constants from '../DTOs/Constants';
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
    
}
